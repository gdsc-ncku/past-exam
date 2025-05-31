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
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8 text-center"
          >
            <motion.div variants={fadeInUp} className="inline-block">
              <h1 className="mb-6 bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
                成大知識共享平台
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mx-auto h-1 rounded-full bg-gradient-to-r from-[#78B103] to-[#CFFF4C]"
              />
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-[#595959] sm:text-2xl"
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
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
              className="group relative rounded-2xl bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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
                  className={`h-14 w-14 bg-gradient-to-br ${feature.gradient} mb-6 flex items-center justify-center rounded-xl`}
                >
                  <feature.icon className="h-7 w-7 text-[#78B103]" />
                </motion.div>
                <h3 className="mb-3 text-2xl font-semibold text-[#1B1B1B]">
                  {feature.title}
                </h3>
                <p className="text-lg text-[#595959]">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#78B103] to-[#5A8604]">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative p-12 text-center sm:p-16">
            <motion.h2
              variants={fadeInUp}
              className="mb-8 text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:text-4xl"
            >
              開始探索課程資源
            </motion.h2>
            <Link href="/search">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="group bg-white px-10 py-4 text-xl font-semibold text-[#78B103] shadow-md transition-colors duration-200 hover:bg-[#F3FFC7]">
                  搜尋課程
                  <ArrowRight className="ml-3 inline-block h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
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
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center space-y-6"
          >
            <motion.h3
              variants={fadeInUp}
              className="bg-gradient-to-r from-[#1B1B1B] to-[#78B103] bg-clip-text text-xl font-semibold text-transparent"
            >
              開發資訊
            </motion.h3>
            <motion.div variants={staggerContainer} className="flex space-x-8">
              {[
                { icon: Github, href: 'https://github.com/gdsc-ncku/past-exam' },
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
                  <item.icon className="h-7 w-7" />
                </motion.a>
              ))}
            </motion.div>
            <motion.p variants={fadeInUp} className="text-sm text-[#909090]">
              © {new Date().getFullYear()} 成大知識共享平台. All rights
              reserved.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
