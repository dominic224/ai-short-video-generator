"use client";
import React, { useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";

const scriptData =
  "Dinosaurs roamed the Earth millions of years ago! The pyramids of Egypt were built thousands of years ago. Chariot races were a popular sport in ancient Rome. The Great Wall of China is one of the longest structures ever built. The Vikings were skilled seafarers and explorers. Medieval knights fought in jousting tournaments. Christopher Columbus sailed across the Atlantic Ocean.";
const FIREURL = "";
function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    // GetVideoScript();
    // GenerateAudioFile(scriptData);
    GenerateAudioCaption(FIREURL);
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
    const result = await axios
      .post("/api/get-video-script", {
        prompt: prompt,
      })
      .then((resp) => {
        setVideoScript(resp.data.result);
        GenerateAudioFile(resp.data.result);
      });
    setLoading(false);
  };

  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);
    let script = "";
    const id = uuidv4();

    // videoScriptData?.forEach((item) => {
    //   script = script + item.ContextText + " ";
    // });

    await axios
      .post("/api/generate-audio", {
        text: videoScriptData,
        id: id,
      })
      .then((resp) => {
        setAudioFileUrl(resp.data.result);
      });

    setLoading(false);
  };

  const GenerateAudioCaption = async (fileUrl) => {
    setLoading(true);

    await axios
      .post("/app/generate-caption", {
        audioFileUrl: fileUrl,
      })
      .then((resp) => {
        console.log(resp.data.result);
      });

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
      </div>
    </div>
  );
}

export default CreateNew;
