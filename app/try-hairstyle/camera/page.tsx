"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  FlipHorizontal,
  Camera as CameraIcon,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HairstyleGallery } from "@/components/hairstyle-gallery";
import {
  getImageLightXResponse,
  getOrderStatus,
  preSignedUrl,
} from "@/services/try-hairStyle/try-hairstyle.api";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedHairstyle, setSelectedHairstyle] = useState<string>("");

  // Function to check order status
  const checkOrderStatus = async (orderId: string) => {
    try {
      const response = await getOrderStatus(orderId);

      if (response.status === 200 && response.data.body?.output) {
        setResultImage(response.data.body.output);
        setProcessingStep("");
        toast.success("Xử lý ảnh hoàn tất!");
        return true;
      } else if (response.status === 200 && !response.data.body?.output) {
        toast.error("Xử lý ảnh thất bại");
        setProcessingStep("");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking order status:", error);
      return false;
    }
  };

  // Effect to poll order status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (orderId && !resultImage) {
      intervalId = setInterval(async () => {
        const isCompleted = await checkOrderStatus(orderId);
        if (isCompleted) {
          clearInterval(intervalId);
        }
        setRetryCount((prev) => prev + 1);
      }, 7000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId, resultImage]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFlipped ? "environment" : "user",
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOn(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
  };

  const flipCamera = () => {
    setIsFlipped(!isFlipped);
    if (stream) {
      stopCamera();
      startCamera();
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleTryHairstyle = async () => {
    if (capturedImage && selectedHairstyle) {
      try {
        setIsLoading(true);
        setProcessingStep("Đang chuẩn bị ảnh...");
        setResultImage(null);
        setRetryCount(0);

        // Convert base64 to Blob to get file size and type
        const base64Data = capturedImage.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: "image/jpeg" });

        // Get image size and type
        const imageData = {
          size: blob.size,
          contentType: blob.type,
        };
        setProcessingStep("Đang lấy URL upload...");
        const signedUrlResponse = await preSignedUrl(imageData);
        const { uploadImage, imageUrl } = signedUrlResponse.body;

        // Upload image to S3 using pre-signed URL
        setProcessingStep("Đang upload ảnh...");
        const data = await axios.put(uploadImage, blob, {
          headers: {
            "Content-Type": blob.type,
          },
        });

        // Send request to LightX API for image processing
        setProcessingStep("Đang xử lý ảnh...");
        const lightXResponse = await getImageLightXResponse({
          imageUrl: imageUrl,
          textPrompt: selectedHairstyle,
        });

        if (lightXResponse.data.body?.orderId) {
          setOrderId(lightXResponse.data.body.orderId);
          setProcessingStep("Đang chờ xử lý ảnh...");
        }
      } catch (error: any) {
        console.error("Error processing image:", error);
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi xử lý ảnh";
        toast.error(errorMessage);
        setProcessingStep("");
      } finally {
        setIsLoading(false);
      }
    } else if (!selectedHairstyle) {
      toast.error("Vui lòng chọn kiểu tóc");
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tighter">Chụp ảnh</h1>
          <p className="text-sm text-gray-500">
            Chụp ảnh khuôn mặt của bạn để thử các kiểu tóc khác nhau
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ảnh gốc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {!capturedImage ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <CameraOff className="w-16 h-16" />
                        </div>
                      )}
                      {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-4 text-center">
                          {error}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={capturedImage}
                        alt="Captured"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2">
                  {!capturedImage ? (
                    <>
                      <Button
                        onClick={isCameraOn ? stopCamera : startCamera}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {isCameraOn ? (
                          <>
                            <CameraOff className="w-4 h-4" />
                            Tắt camera
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4" />
                            Bật camera
                          </>
                        )}
                      </Button>

                      {isCameraOn && (
                        <>
                          <Button
                            onClick={flipCamera}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <FlipHorizontal className="w-4 h-4" />
                            Đổi camera
                          </Button>

                          <Button
                            onClick={capturePhoto}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <CameraIcon className="w-4 h-4" />
                            Chụp ảnh
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={retakePhoto}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Chụp lại
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Kết quả</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {resultImage ? (
                    <Image
                      src={resultImage}
                      alt="Result"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      {processingStep ? (
                        <div className="text-center">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-1" />
                          <p className="text-sm">{processingStep}</p>
                        </div>
                      ) : (
                        <p className="text-sm">Chưa có kết quả</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chọn kiểu tóc</CardTitle>
            </CardHeader>
            <CardContent>
              <HairstyleGallery
                onSelect={setSelectedHairstyle}
                selectedPrompt={selectedHairstyle}
              />
            </CardContent>
          </Card>

          {capturedImage && (
            <div className="flex justify-center">
              <Button
                onClick={handleTryHairstyle}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">{processingStep}</span>
                  </>
                ) : (
                  <>
                    <CameraIcon className="h-4 w-4" />
                    <span className="text-sm">Thử kiểu tóc</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
