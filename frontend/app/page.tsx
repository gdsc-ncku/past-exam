'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/ui/Button';
import {
  Search,
  Github,
  Mail,
  ArrowRight,
  BookOpen,
  Users,
  Share2,
  Scale,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RecentFiles } from '@/app/components/RecentFiles';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 },
};

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-white via-[#F3FFC7]/30 to-white"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 bg-[url('/grid.svg')]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6 text-center sm:space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-block">
              <h1 className="mb-4 bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-3xl font-bold leading-tight text-transparent sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                成大知識共享平台
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-[#78B103] to-[#CFFF4C] lg:w-24"
              />
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl px-4 text-base font-light leading-relaxed text-[#595959] sm:px-0 sm:text-lg lg:text-xl xl:text-2xl"
            >
              成大知識共享平台是一個專為成大學生打造的資源交流平台，希望消除因知識壟斷而造成的資訊不透明，促進平等、知識共享與開源的願景。
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: '知識共享',
              description: '打破知識壁壘，促進學術資源的自由流通',
              gradient: 'from-[#F3FFC7] to-[#CFFF4C]',
            },
            {
              icon: Users,
              title: '社群協作',
              description: '凝聚學生力量，共同打造開放學習環境',
              gradient: 'from-[#E6FF95] to-[#CFFF4C]',
            },
            {
              icon: Scale,
              title: '平等互助',
              description: '打破資訊不對等，建立互助共好的學習環境',
              gradient: 'from-[#CFFF4C] to-[#E6FF95]',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group relative rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`h-12 w-12 bg-gradient-to-br sm:h-14 sm:w-14 ${feature.gradient} mb-4 flex items-center justify-center rounded-xl sm:mb-6`}
                >
                  <feature.icon className="h-6 w-6 text-[#78B103] sm:h-7 sm:w-7" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-[#1B1B1B] sm:mb-3 sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-base text-[#595959] sm:text-lg">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Files Section */}
      <RecentFiles />

      {/* CTA Section */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#78B103] to-[#5A8604] sm:rounded-3xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative p-8 text-center sm:p-12 lg:p-16">
            <motion.h2
              variants={fadeInUp}
              className="mb-6 text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:mb-8 sm:text-3xl lg:text-4xl"
            >
              開始探索課程資源
            </motion.h2>
            <Link href="/search">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="group bg-white px-6 py-3 text-lg font-semibold text-[#78B103] shadow-md transition-colors duration-200 hover:bg-[#F3FFC7] sm:px-10 sm:py-4 sm:text-xl">
                  搜尋課程
                  <ArrowRight className="ml-2 inline-block h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 sm:ml-3 sm:h-6 sm:w-6" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="relative border-t border-[#F0F0F0] bg-gradient-to-b from-white to-[#F3FFC7]/20"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center space-y-4 sm:space-y-6"
          >
            <motion.h3
              variants={fadeInUp}
              className="bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-lg font-semibold text-transparent sm:text-xl"
            >
              開發資訊
            </motion.h3>
            <motion.div
              variants={staggerContainer}
              className="flex space-x-6 sm:space-x-8"
            >
              {[
                {
                  icon: Github,
                  href: 'https://github.com/gdsc-ncku/past-exam',
                },
                { icon: Mail, href: 'mailto:your-email@example.com' },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1, color: '#78B103' }}
                  whileTap={{ scale: 0.95 }}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    item.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="text-[#595959] transition-colors"
                >
                  <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.a>
              ))}
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-center text-xs text-[#909090] sm:text-sm"
            >
              © {new Date().getFullYear()} 成大知識共享平台. All rights
              reserved.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
