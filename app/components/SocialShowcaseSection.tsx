'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { ease } from './motion/reveal';

interface InstagramPost {
  id: string;
  image: string;
  type: 'product' | 'lifestyle' | 'experience' | 'behind-the-scenes';
  aspectRatio: string; // Tailwind aspect classes for dynamic masonry look
  caption: string;
  link: string;
}

const MOCK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post_1',
    image: '/categories-images/Oud.png',
    type: 'product',
    aspectRatio: 'aspect-[3/4]',
    caption: 'The essence of pure luxury: exploring the depths of our signature Oud.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_2',
    image: '/categories-images/Women.png',
    type: 'lifestyle',
    aspectRatio: 'aspect-[1/1]',
    caption: 'Modern luxury identity, crafted for every expression.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_3',
    image: '/categories-images/Premium.png',
    type: 'experience',
    aspectRatio: 'aspect-[4/5]',
    caption: 'Chosen by those who leave lasting impressions.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_4',
    image: '/categories-images/Attars.png',
    type: 'behind-the-scenes',
    aspectRatio: 'aspect-[3/2]',
    caption: 'Traditional attars meets modern luxury: behind the curation of our natural oils.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_5',
    image: '/categories-images/YAM N-7 Signature.jpg',
    type: 'product',
    aspectRatio: 'aspect-[4/5]',
    caption: 'Minimal outside. Infinite within. The signature series.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_6',
    image: '/categories-images/Men.png',
    type: 'lifestyle',
    aspectRatio: 'aspect-[1/1]',
    caption: 'Define your presence. Own your identity.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_7',
    image: '/categories-images/Elite.png',
    type: 'experience',
    aspectRatio: 'aspect-[3/4]',
    caption: 'Our Elite collection: for the extraordinary.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_8',
    image: '/categories-images/Zodiac.png',
    type: 'behind-the-scenes',
    aspectRatio: 'aspect-[3/2]',
    caption: 'Written in the stars: behind the scenes of the Zodiac series launch.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_9',
    image: '/categories-images/General.png',
    type: 'product',
    aspectRatio: 'aspect-[4/5]',
    caption: 'Crafted using premium fragrance oils. Authentic ingredients only.',
    link: 'https://instagram.com/yamn7',
  },
  {
    id: 'post_10',
    image: '/categories-images/Gift Sets.png',
    type: 'lifestyle',
    aspectRatio: 'aspect-[1/1]',
    caption: 'The art of gifting, refined. Elevate your presence.',
    link: 'https://instagram.com/yamn7',
  },
];

export default function SocialShowcaseSection() {
  // NOTE: In the future, you can integrate this with a real Instagram API (e.g. Instagram Graph API / Basic Display API)
  // Example:
  // useEffect(() => {
  //   fetch('https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption&access_token=YOUR_TOKEN')
  //     .then(res => res.json())
  //     .then(data => setPosts(data.data));
  // }, []);

  return (
    <section
      style={{
        background: '#0A0A0A',
        color: '#FFFFFF',
        padding: '100px 24px',
        borderBottom: '1px solid rgba(200, 164, 107, 0.12)',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.45em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.24em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            style={{
              fontFamily: 'var(--font-body), Poppins, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#C8A46B',
              margin: '0 0 16px',
              fontWeight: 500,
            }}
          >
            Social Journal
          </motion.p>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Follow The Journey
          </h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.18, ease }}
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(200, 164, 107, 0.35)',
              margin: '20px auto 0',
              transformOrigin: 'center',
            }}
          />
        </motion.div>

        {/* Masonry Grid Layout using CSS columns */}
        <div
          className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
          style={{
            columnFill: 'balance',
          }}
        >
          {MOCK_INSTAGRAM_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: (i % 5) * 0.1, ease }}
              className={`break-inside-avoid block relative overflow-hidden group bg-[#111111] border border-white/5 rounded-sm ${post.aspectRatio}`}
              style={{
                width: '100%',
                display: 'block',
              }}
            >
              {/* Image */}
              <img
                src={post.image}
                alt={post.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                className="group-hover:scale-105"
                loading="lazy"
              />

              {/* Gold & Dark Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(10,10,10,0.6) 0%, rgba(200,164,107,0.3) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
                className="group-hover:opacity-100"
              >
                {/* Instagram Icon centered */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1 }}
                  className="transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    background: 'rgba(10, 10, 10, 0.8)',
                    padding: '12px',
                    borderRadius: '50%',
                    border: '1px solid rgba(200, 164, 107, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                >
                  <Instagram size={20} style={{ color: '#C8A46B' }} strokeWidth={1.5} />
                </motion.div>

                {/* Sub-label/Type Badge on Hover */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body), Poppins, sans-serif',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: 'rgba(10, 10, 10, 0.65)',
                      padding: '4px 8px',
                      borderRadius: '2px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {post.type.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer Instagram handle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <motion.a
            href="https://instagram.com/yamn7"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-display), "Playfair Display", serif',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: '#C8A46B',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              position: 'relative',
              fontWeight: 500,
              paddingBottom: '4px',
            }}
          >
            <Instagram size={18} strokeWidth={1.5} />
            <span>@yamn7</span>
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: '#C8A46B',
                transform: 'scaleX(0.3)',
                transformOrigin: 'center',
                transition: 'transform 0.3s ease',
              }}
              className="hover-underline"
            />
          </motion.a>
        </motion.div>
      </div>
      {/* CSS hover styles for link underline */}
      <style>{`
        a:hover .hover-underline {
          transform: scaleX(1) !important;
        }
      `}</style>
    </section>
  );
}
