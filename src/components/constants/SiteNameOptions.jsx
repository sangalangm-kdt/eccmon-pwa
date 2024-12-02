import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";

const siteNames = [
  "アサヒビール",
  "アドヴィックス刈谷",
  "伊丹産業",
  "イビデン大垣中央",
  "イビデン河間",
  "SLNG",
  "王子マテリア江戸川",
  "沖電牧港",
  "義芳化学",
  "クラレ",
  "KYB岐阜北",
  "神戸PC 3号機",
  "神戸PC 4号機",
  "Ｓｉａｍ DENSO",
  "CCM",
  "椎の森パワー",
  "JFEスチール",
  "ジェイテクト岡崎",
  "JES",
  "静岡ガス&パワー",
  "昭和産業",
  "新宿地冷",
  "SUBARU",
  "SUBARU大泉",
  "DNP鶴瀬",
  "太平洋セメント",
  "太平洋セメント埼玉",
  "中外製薬藤枝",
  "中部国際空港",
  "TPA 1号機（KG12V）",
  "TPA 2号機（KG18V）",
  "TMMIN",
  "デイ・シイ川崎",
  "帝人三島",
  "テクノ上越",
  "テクノ袖ヶ浦",
  "デンソー岩手",
  "デンソー幸田",
  "デンソー善明",
  "デンソー大安",
  "デンソー第一安城",
  "デンソー第二安城",
  "デンソー高棚",
  "デンソー豊橋",
  "デンソー西尾北",
  "デンソー西尾南",
  "東京ガス根岸",
  "東京都下水道局",
  "東芝横浜",
  "東洋紡敦賀",
  "東レ三島",
  "特種東海製紙三島",
  "豊科フィルム",
  "トヨタ車体",
  "トヨタ東日本",
  "トヨタ北海道",
  "トヨタ三好",
  "トヨタ元町",
  "虎ノ門・麻布台",
  "那珂GP",
  "長岡パワー",
  "日軽金清水",
  "日産追浜",
  "日東紡績",
  "日本キャンパック",
  "日本橋室町",
  "Berkprai",
  "HATC",
  "パナソニック大泉増設",
  "パナソニック東京",
  "日野羽村",
  "富士電機松本",
  "北海道ガス石狩",
  "北海道ガス札幌",
  "本田鈴鹿",
  "マルヤス工業",
  "Malay Sino",
  "茂原パワー",
  "森永乳業",
  "八重洲",
  "トヨタ本社",
  "Ratch",
  "レンゴー利根川",
  "RenKorat",
];

const SiteNameOptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group site names by the first letter
  const groupedNames = siteNames.reduce((acc, name) => {
    const firstLetter = name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(name);
    return acc;
  }, {});

  // Filter grouped names based on search term
  const filteredGroupedNames = Object.keys(groupedNames)
    .sort()
    .reduce((acc, letter) => {
      const filteredNames = groupedNames[letter].filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      if (filteredNames.length > 0) {
        acc[letter] = filteredNames;
      }
      return acc;
    }, {});

  // If search term exists, flatten the filtered names
  const searchResults = searchTerm
    ? siteNames.filter((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleSelectName = (name) => {
    setSelectedSite(name);
    setSearchTerm("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col mt-24">
      <div className="relative w-full ">
        <label>Site name</label>
        <input
          className="border w-full p-2 rounded"
          type="text"
          placeholder="Select a site"
          value={selectedSite}
          readOnly
          onClick={() => setIsModalOpen(true)}
        />
        <button
          className="absolute mt-3 right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsModalOpen(true)}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <button
              className="text-gray-500"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <input
              className="border w-full p-2 rounded"
              type="text"
              placeholder="Search site names"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Vertical List */}
          <div className="flex-1 overflow-y-auto p-4">
            {searchTerm ? (
              <ul className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((name) => (
                    <li
                      key={name}
                      className="cursor-pointer hover:bg-cyan-100"
                      onClick={() => handleSelectName(name)}
                    >
                      {name}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No results found</p>
                )}
              </ul>
            ) : (
              Object.keys(filteredGroupedNames).map((letter) => (
                <div key={letter} className="mb-4">
                  <h3 className="text-lg font-bold">{letter}</h3>
                  <ul className="ml-4 space-y-2">
                    {filteredGroupedNames[letter].map((name) => (
                      <li
                        key={name}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectName(name)}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteNameOptions;
