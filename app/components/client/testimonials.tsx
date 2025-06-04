const Testimonials = () => {
  const testimonials = [
    {
      company: "LankaMart",
      quote: "Smart Bill made our transactions seamless! Managing sales has never been this easy.",
      author: "Ruwan Perera",
    },
    {
      company: "Ceylon Tech Hub",
      quote: "We love the inventory management features. Smart Bill helps us track everything efficiently!",
      author: "Dilini Fernando",
    },
    {
      company: "New Age Fashion",
      quote: "Billing and sales reports are now hassle-free. Smart Bill is a game changer!",
      author: "Shanika Jayawardena",
    },
    {
      company: "Spicy Flavors",
      quote: "Handling restaurant orders is so smooth with Smart Bill. The kitchen display system is a lifesaver!",
      author: "Suresh De Silva",
    },
    {
      company: "Jaya Super City",
      quote: "From barcode scanning to invoice printing, Smart Bill does it all! Highly recommended.",
      author: "Vikum Rathnayake",
    },
  ];

  const infiniteTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-8 text-black">What Our Clients Say</h2>
        <div className="relative">
          <div className="flex space-x-14 animate-scroll no-scrollbar">
            {infiniteTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-[400px] flex flex-col justify-center items-center gap-[20px] flex-shrink-0 p-6 bg-white shadow-lg rounded-lg mx-2"
              >
                <h3 className="text-2xl font-semibold text-secondary mb-2">{testimonial.company}</h3>
                <p className="italic text-black max-w-[300px] break-words">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="font-semibold text-black text-opacity-50 mt-4">– {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
