"use client";
import { VideoDataContext } from "@/app/_context/VideoDataContext";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PlayerDialog from "../_components/PlayerDialog";
import CustomLoading from "./_components/CustomLoading";
import SelectDuration from "./_components/SelectDuration";
import SelectStyle from "./_components/SelectStyle";
import SelectTopic from "./_components/SelectTopic";

function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();

  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    GetVideoScript();
  };

  // Get Video Script
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt =
      "Write a script to generate " +
      formData.duration +
      " video on topic: " +
      formData.topic +
      " along with AI image prompt in " +
      formData.imageStyle +
      " format for each scene and give me result in JSON format with imagePrompt and ContextText as field, No Plain text";

    const resp = await axios.post("/api/get-video-script", {
      prompt: prompt,
    });

    if (resp.data.result) {
      setVideoData((prev) => ({
        ...prev,
        videoScript: resp.data.result,
      }));
      setVideoScript(resp.data.result);
      resp.data.result && GenerateAudioFile(resp.data.result);
    }
  };

  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);
    let script = "";
    const id = uuidv4();

    videoScriptData?.forEach((item) => {
      script = script + item.ContextText + " ";
    });

    const resp = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
    });

    setVideoData((prev) => ({
      ...prev,
      audioFileUrl: resp.data.result,
    }));

    setAudioFileUrl(resp.data.result);

    resp.data.result &&
      (await GenerateAudioCaption(resp.data.result, videoScriptData));
  };

  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);

    const resp = await axios.post("/app/generate-caption", {
      audioFileUrl: fileUrl,
    });

    setVideoData((prev) => ({
      ...prev,
      captions: resp.data.result,
    }));

    setCaptions(resp.data.result);
    resp.data.result && GenerateImage(videoScriptData);
  };

  const GenerateImage = async (videoScriptData) => {
    let images = [];

    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element.imagePrompt,
        });
        images.push(resp.data.result);
      } catch (e) {
        console.log("Error:" + e);
      }
    }

    setVideoData((prev) => ({
      ...prev,
      imageList: images,
    }));

    setImageList(images);
    setLoading(false);
  };

  useEffect(() => {
    if (Object.keys(videoData).length === 4) {
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const SaveVideoData = async (videoData) => {
    setLoading(true);

    const result = await db
      .insert(VideoData)
      .values({
        script: videoData?.script,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: VideoData?.id });

    setVideoId(result[0]?.id);
    setPlayVideo(true);
    setLoading(false);
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>

      <div className="mt-10 shadow-md p-10">
        {/** Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/** Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/** Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/** Create Button */}
        <Button className="mt-10 w-full" onClick={onCreateClickHandler}>
          Create Short Video
        </Button>

        <CustomLoading loading={loading} />

        <PlayerDialog playVideo={playVideo} videoId={videoId} />
      </div>
    </div>
  );
}

export default CreateNew;
