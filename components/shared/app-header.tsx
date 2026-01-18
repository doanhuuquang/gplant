"use client";

import { useState } from "react";
import { AccountDropdown } from "@/components/shared/account-dropdown";
import AppLogo from "@/components/shared/app-logo";
import { MenuMobile } from "@/components/shared/menu-mobile";
import { Button } from "@/components/ui/button";
import type Category from "@/lib/models/category";
import { Overlay } from "@/components/shared/overlay";
import { Navbar } from "@/components/shared/navbar";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/shared/search-bar";
import { ShoppingBag } from "lucide-react";

const categories: Category[] = [
  // ===== INDOOR PLANTS (Cấp 1) =====
  {
    id: "1",
    name: "Indoor Plants",
    slug: "indoor-plants",
    description: "Beautiful indoor plants for your home",
    imageUrl:
      "https://images.unsplash.com/photo-1610232603071-0070518c79d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA2fHxpbmRvb3IlMjBwbGFudHxlbnwwfDJ8MHx8fDA%3D",
  },
  {
    id: "1-1",
    name: "Low Light Plants",
    slug: "low-light-plants",
    description: "Plants that thrive in low light conditions",
    imageUrl: "/images/low-light-plants.jpg",
    parentId: "1",
  },
  {
    id: "1-2",
    name: "Flowering Houseplants",
    slug: "flowering-houseplants",
    description: "Colorful flowering plants for indoors",
    imageUrl: "/images/flowering-houseplants.jpg",
    parentId: "1",
  },
  {
    id: "1-3",
    name: "Succulents & Cacti",
    slug: "succulents-cacti",
    description: "Low maintenance succulents and cacti",
    imageUrl: "/images/succulents.jpg",
    parentId: "1",
  },

  // ===== OUTDOOR PLANTS (Cấp 1) =====
  {
    id: "2",
    name: "Outdoor Plants",
    slug: "outdoor-plants",
    description: "Plants for your garden and outdoor spaces",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1723568489729-6eceeec1c7fb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fG91dGRvb3IlMjBwbGFudHxlbnwwfDJ8MHx8fDA%3D",
  },
  {
    id: "2-1",
    name: "Trees & Shrubs",
    slug: "trees-shrubs",
    description: "Large trees and shrubs for landscaping",
    imageUrl: "/images/trees-shrubs.jpg",
    parentId: "2",
  },
  {
    id: "2-2",
    name: "Perennials",
    slug: "perennials",
    description: "Long-lasting perennial flowers",
    imageUrl: "/images/perennials.jpg",
    parentId: "2",
  },
  {
    id: "2-3",
    name: "Ground Covers",
    slug: "ground-covers",
    description: "Decorative ground cover plants",
    imageUrl: "/images/ground-covers.jpg",
    parentId: "2",
  },

  // ===== HOME & GARDEN SUPPLY (Cấp 1) =====
  {
    id: "3",
    name: "Home & Garden Supply",
    slug: "home-garden-supply",
    description: "Everything for your gardening needs",
    imageUrl:
      "https://images.unsplash.com/photo-1759455032643-328e17e73626?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEhvbWUlMjAlMjYlMjBHYXJkZW4lMjBTdXBwbHl8ZW58MHwyfDB8fHww",
  },
  {
    id: "3-1",
    name: "Soil & Compost",
    slug: "soil-compost",
    description: "Quality soil and compost for plants",
    imageUrl: "/images/soil-compost.jpg",
    parentId: "3",
  },
  {
    id: "3-2",
    name: "Fertilizers & Plant Food",
    slug: "fertilizers-plant-food",
    description: "Organic and chemical fertilizers",
    imageUrl: "/images/fertilizers.jpg",
    parentId: "3",
  },
  {
    id: "3-3",
    name: "Tools & Equipment",
    slug: "tools-equipment",
    description: "Essential gardening tools and equipment",
    imageUrl: "/images/tools.jpg",
    parentId: "3",
  },

  // ===== SEEDS & GROW KITS (Cấp 1) =====
  {
    id: "4",
    name: "Seeds & Grow Kits",
    slug: "seeds-grow-kits",
    description: "Seeds and complete grow kits",
    imageUrl:
      "https://images.unsplash.com/photo-1705937071166-d8acc4825ad7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U2VlZHMlMjAlMjYlMjBHcm93JTIwS2l0c3xlbnwwfDJ8MHx8fDA%3D",
  },
  {
    id: "4-1",
    name: "Vegetable Seeds",
    slug: "vegetable-seeds",
    description: "Fresh vegetable seeds for gardening",
    imageUrl: "/images/vegetable-seeds.jpg",
    parentId: "4",
  },
  {
    id: "4-2",
    name: "Flower Seeds",
    slug: "flower-seeds",
    description: "Beautiful flower seeds",
    imageUrl: "/images/flower-seeds.jpg",
    parentId: "4",
  },
  {
    id: "4-3",
    name: "DIY Grow Kits",
    slug: "diy-grow-kits",
    description: "Complete DIY growing kits",
    imageUrl: "/images/diy-kits.jpg",
    parentId: "4",
  },

  // ===== POTS (Cấp 1) =====
  {
    id: "5",
    name: "Pots",
    slug: "pots",
    description: "Beautiful pots and planters",
    imageUrl:
      "https://images.unsplash.com/photo-1594664060766-626bd3d3b387?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG90c3xlbnwwfDJ8MHx8fDA%3D",
  },
  {
    id: "5-1",
    name: "Ceramic Pots",
    slug: "ceramic-pots",
    description: "Elegant ceramic pots",
    imageUrl: "/images/ceramic-pots.jpg",
    parentId: "5",
  },
  {
    id: "5-2",
    name: "Plastic Pots",
    slug: "plastic-pots",
    description: "Durable plastic pots",
    imageUrl: "/images/plastic-pots.jpg",
    parentId: "5",
  },
  {
    id: "5-3",
    name: "Terra Cotta",
    slug: "terra-cotta",
    description: "Classic terra cotta pots",
    imageUrl: "/images/terra-cotta.jpg",
    parentId: "5",
  },
];

export default function AppHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Overlay
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />

      <header
        className={cn(
          "w-full h-fit bg-background sticky top-0 z-50 border-b border-b-transparent",
          isDropdownOpen && "border-b-border",
        )}
      >
        <div className="w-full max-w-350 mx-auto p-4 flex items-center justify-between gap-10">
          <AppLogo className="shrink-0" />

          <SearchBar className="md:flex hidden w-full max-w-7xl" />

          <div className="flex items-center gap-3">
            <AccountDropdown />

            <Button
              variant={"outline"}
              className="aspect-square rounded-full shadow-xl shadow-muted dark:shadow-black/50"
            >
              <ShoppingBag className="size-5" />
            </Button>

            <MenuMobile categories={categories} className="md:hidden block" />
          </div>
        </div>

        <div className="w-full max-w-350 mx-auto md:block hidden mt-2">
          <Navbar categories={categories} onDropdownOpen={setIsDropdownOpen} />
        </div>
      </header>
    </>
  );
}
