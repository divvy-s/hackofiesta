"use client";

import React from "react";
import { galleryImages } from "@/constants/galleryImages";
import { GalleryImages } from "@/interface/galleryImagesInterface";

import HackathonGallery from "./ui/parallax-scroll";

export default function Gallery() {
    return (
        <HackathonGallery
            images={galleryImages}
            title="Hackofiesta 2025"
            subtitle="will fill later"
        />
    )
}


