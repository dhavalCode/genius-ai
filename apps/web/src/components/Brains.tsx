"use-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";


import { Card, CardFooter, CardHeader } from "@genius-ai/ui";

import EmptyImg from "@/assets/empty.png";
import { useSearchParams } from "next/navigation";
import { BrainCustomType } from "@genius-ai/lib/query";

interface BrainsProps {
  data: BrainCustomType[];
}

export const Brains = ({ data }: BrainsProps) => {
  const [filterData, setFilterData] = useState<BrainCustomType[]>([]);

  const searchParams = useSearchParams();

  const categoryId = searchParams?.get("categoryId");

  useEffect(() => {
    if (categoryId) {
      setFilterData(data.filter((item) => item.categoryId === categoryId));
    } else {
      setFilterData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  return (
    <>
      {filterData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
          {filterData.map((item) => (
            <Card
              key={item.name}
              className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
            >
              <Link href={`/chat/${item.id}`}>
                <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                  <div className="relative w-32 h-32">
                    <Image
                      src={item.src}
                      fill
                      className="rounded-xl object-cover"
                      alt="Character"
                    />
                  </div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs">{item.description}</p>
                </CardHeader>
                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                  {/* <p className="lowercase">@{item.userName}</p> */}
                  <div className="flex items-center justify-self-end">
                    <MessagesSquare className="w-3 h-3 mr-1" />
                    {item._count.messages}
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
      {filterData.length === 0 && (
        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-60 h-60">
            <Image fill className="grayscale" src={EmptyImg} alt="Empty" />
          </div>
          <p className="text-sm text-muted-foreground">No Brains found.</p>
        </div>
      )}
    </>
  );
};
