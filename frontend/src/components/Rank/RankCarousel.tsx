import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Rank } from '../types/types';

interface RankCarouselProps {
  ranks: Rank[];
  currentRank: number;
  calculateProgress: (rankId: number) => number;
}

export const RankCarousel: React.FC<RankCarouselProps> = ({
  ranks,
  currentRank,
  calculateProgress,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Jornada de Ranks</h2>
      <Swiper
        modules={[Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="rank-carousel"
      >
        {ranks.map((rank) => (
          <SwiperSlide key={rank.id}>
            <div
              className={`p-6 rounded-lg transition-all duration-300 ${
                rank.id === currentRank
                  ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-lg transform scale-105'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: rank.color }}
                >
                  {rank.id}
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{rank.name}</h3>
                  <p
                    className={`text-sm font-medium ${
                      rank.difficulty === 'Easy'
                        ? 'text-green-600'
                        : rank.difficulty === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {rank.difficulty}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  XP Necessário: {rank.xpRequired}
                </div>
                {rank.id === currentRank && (
                  <div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                        style={{ width: `${calculateProgress(rank.id)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {calculateProgress(rank.id)}% concluído
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
