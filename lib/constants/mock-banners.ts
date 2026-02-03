import Banner from "@/lib/models/banner";
import { BannerGroup } from "@/lib/enums/banner-group";

export const MOCK_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Cây cảnh cao cấp",
    description: "Bộ sưu tập cây cảnh cao cấp nhập khẩu từ các nước",
    imageUrl: "/images/banners/banner-1.jpg",
    redirectUrl: "/products/premium-plants",
    group: BannerGroup.Carousel,
    orderIndex: 1,
    isActive: true,
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: "2026-01-27T10:30:00Z",
  },
  {
    id: "banner-2",
    title: "Dụng cụ làm vườn chuyên dụng",
    description:
      "Công cụ và thiết bị chuyên dụng cho những người yêu thích làm vườn",
    imageUrl: "/images/banners/banner-2.jpg",
    redirectUrl: "/products/gardening-tools",
    group: BannerGroup.Carousel,
    orderIndex: 2,
    isActive: true,
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-27T10:30:00Z",
  },
  {
    id: "banner-3",
    title: "Chương trình khuyến mãi mùa hè",
    description: "Giảm giá lên đến 50% cho tất cả sản phẩm mùa hè",
    imageUrl: "/images/banners/banner-3.jpg",
    redirectUrl: "/promotions/summer-sale",
    group: BannerGroup.Carousel,
    orderIndex: 3,
    isActive: true,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-27T10:30:00Z",
  },
  {
    id: "banner-4",
    title: "Hướng dẫn chăm sóc cây",
    description: "Tìm hiểu cách chăm sóc cây cảnh một cách chuyên nghiệp",
    imageUrl: "/images/banners/banner-4.jpg",
    redirectUrl: "/guides/plant-care",
    group: BannerGroup.Carousel,
    orderIndex: 4,
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-27T10:30:00Z",
  },
];
