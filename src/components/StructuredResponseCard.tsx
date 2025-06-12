import React from "react";

type StructuredResponse = {
  title: string;
  intro: string;
  categories: { label: string; places: string[] }[];
  closing: string;
};

export const StructuredResponseCard = ({ data }: { data: StructuredResponse }) => (
  <div className="bg-white text-black rounded-xl shadow p-4 w-full max-w-3xl">
    <h2 className="text-xl font-bold mb-2">{data.title}</h2>
    <p className="mb-4">{data.intro}</p>
    <div className="space-y-3">
      {data.categories.map((cat, i) => (
        <div key={i}>
          <h3 className="font-semibold">{cat.label}</h3>
          <ul className="list-disc ml-6">
            {cat.places.map((place, j) => <li key={j}>{place}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <p className="mt-4 italic">{data.closing}</p>
  </div>
);
