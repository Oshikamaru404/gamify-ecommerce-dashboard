
import React from 'react';
import { Card } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      avatar: "https://placekitten.com/100/100",
      name: "Marie D.",
      text: "La qualité de l'image est exceptionnelle, même sur les chaînes internationales. Je recommande vivement !"
    },
    {
      avatar: "https://placekitten.com/101/101",
      name: "Pierre L.",
      text: "Le rapport qualité-prix est imbattable. Plus de 8000 chaînes et un catalogue VOD impressionnant."
    },
    {
      avatar: "https://placekitten.com/102/102",
      name: "Sophie M.",
      text: "L'interface est intuitive et le support client est très réactif. Parfait pour toute la famille."
    }
  ];

  return (
    <section className="bg-[#ff2d2d] py-20">
      <div className="container">
        <h2 className="mb-4 text-center text-4xl font-bold text-white">
          99% de clients satisfaits
        </h2>
        <p className="text-center text-xl text-gray-100 mb-16">
          Rejoignez notre communauté de téléspectateurs satisfaits
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-gradient-to-br from-[#ff5555] to-[#ff7777] border-none hover:shadow-xl transition-all">
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-20 w-20 rounded-full mb-6 border-4 border-white"
                />
                <h4 className="font-bold text-xl text-white mb-2">{testimonial.name}</h4>
                <p className="text-base text-gray-100">{testimonial.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
