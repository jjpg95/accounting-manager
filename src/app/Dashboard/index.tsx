'use client';

import { useState } from 'react';
import { DiaryModal } from './components/diaryModal';

export default function Dashboard() {
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsDiaryModalOpen(true);
  };

  return (
    <main>
      <div className="pt-16 overflow-hidden isolate relative">
        <header className="pt-6 sm:pb-6">
          <div className="flex items-center max-w-7xl sm:px-6 gap-6 mx-auto">
            <h1 className="font-semibold text-base">Cashflow</h1>
            <div className="flex text-sm sm:pl-6 sm:border-gray-300 sm:border-l sm:border-solid sm:w-auto sm:order-none font-semibold gap-x-8">
              <a href="#" className="text-indigo-600">
                Last 7 days
              </a>
              <a href="#" className="text-indigo-600">
                Last 30 days
              </a>
              <a href="#" className="text-indigo-600">
                All-time
              </a>
            </div>
            <div className="flex ml-auto gap-x-3">
              <a
                href="#"
                className="flex ml-auto text-white shadow-sm bg-indigo-600 font-semibold text-sm py-2 px-3 rounded-md gap-x-1 items-center hover:bg-indigo-700"
                onClick={handleOpenModal}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  className="w-5 h-5 -ml-1.5"
                >
                  <path d="M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"></path>
                </svg>
                Añadir registro
              </a>
              <a
                href="#"
                className="flex ml-auto text-indigo-600 shadow-sm bg-white font-semibold text-sm py-2 px-3 rounded-md gap-x-1 items-center border border-indigo-600 hover:bg-indigo-50"
                onClick={handleOpenModal}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  className="w-5 h-5 -ml-1.5"
                >
                  <path d="M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"></path>
                </svg>
                Añadir Libro
              </a>
            </div>
          </div>
        </header>
        <div className="border-b border-b-gray-300">
          <dl className="grid mx-auto max-w-7xl grid-cols-2">
            <div className="flex border px-6 py-10 border-gray-300 border-t gap-y-2 gap-x-4 justify-between items-baseline flex-wrap">
              <dt className="text-gray-500 font-medium text-sm">Revenue</dt>
              <dd className="text-black font-medium text-xs">+4.75%</dd>
              <dd className="flex-none w-full text-black font-medium tracking-tight text-3xl">
                $405,091.00
              </dd>
            </div>
            <div className="flex border px-6 py-10 border-gray-300 border-t gap-y-2 gap-x-4 justify-between items-baseline flex-wrap">
              <dt className="text-gray-500 font-medium text-sm">
                Overdue invoices
              </dt>
              <dd className="text-black font-medium text-xs">+54.02%</dd>
              <dd className="flex-none w-full text-black font-medium tracking-tight text-3xl">
                $12,787.00
              </dd>
            </div>
            <div className="flex border px-6 py-10 border-gray-300 border-t gap-y-2 gap-x-4 justify-between items-baseline flex-wrap">
              <dt className="text-gray-500 font-medium text-sm">
                Outstanding invoices
              </dt>
              <dd className="text-black font-medium text-xs">-1.39%</dd>
              <dd className="flex-none w-full text-black font-medium tracking-tight text-3xl">
                $245,988.00
              </dd>
            </div>
            <div className="flex border px-6 py-10 border-gray-300 border-t gap-y-2 gap-x-4 justify-between items-baseline flex-wrap">
              <dt className="text-gray-500 font-medium text-sm">Expenses</dt>
              <dd className="text-black font-medium text-xs">+10.18%</dd>
              <dd className="flex-none w-full text-black font-medium tracking-tight text-3xl">
                $30,156.00
              </dd>
            </div>
          </dl>
        </div>
        <div
          aria-hidden="true"
          className="sm:opacity-50 sm:rotate-0 sm:translate-x-1 sm:-ml-6 sm:-mt-10 sm:left-2/4 transform translate-x-4 translate-y-8 filter blur-md brightness-150 grayscale rotate-x-45 skew-y-6 origin-top-left top-full left-0 absolute -z-10"
        >
          <div
            style={{
              clipPath:
                'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
            }}
            className="bfql bfqw bftk bftl bftm"
          ></div>
        </div>
      </div>
      <DiaryModal
        isModalOpen={isDiaryModalOpen}
        setIsModalOpen={setIsDiaryModalOpen}
      />
    </main>
  );
}
