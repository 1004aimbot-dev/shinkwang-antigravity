export interface Recommendation {
    keyword: string[];
    verse: {
        text: string;
        reference: string;
    };
    comfortMessage: string;
    praises: {
        title: string;
        link: string; // YouTube search link
    }[];
}

export const recommendations: Recommendation[] = [
    {
        keyword: ['힘듬', '지침', '피곤', '위로', '어려움'],
        verse: {
            text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라",
            reference: "마태복음 11:28"
        },
        comfortMessage: "삶의 무게가 너무 무겁게 느껴질 때가 있습니다. 누구에게도 말하지 못하고 혼자 끙끙 앓고 계시진 않나요? 주님은 당신의 그 지친 어깨를 알고 계십니다. '수고했다, 내 딸아, 내 아들아' 말씀하시는 주님의 음성에 귀 기울여보세요. 잠시 모든 짐을 내려놓고 주님의 품 안에서 참된 쉼을 누리시길 기도합니다. 당신은 혼자가 아닙니다.",
        praises: [
            { title: "주 품에 품으소서", link: "https://www.youtube.com/results?search_query=주+품에+품으소서+찬양" },
            { title: "광야를 지나며", link: "https://www.youtube.com/results?search_query=광야를+지나며+찬양" },
            { title: "주가 일하시네", link: "https://www.youtube.com/results?search_query=주가+일하시네+찬양" }
        ]
    },
    {
        keyword: ['불안', '걱정', '두려움', '근심'],
        verse: {
            text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라",
            reference: "빌립보서 4:6"
        },
        comfortMessage: "알 수 없는 불안함이 마음을 흔들 때, 우리는 쉽게 무너집니다. 하지만 폭풍우 몰아치는 바다 위에서도 주님은 함께 계십니다. 당신의 모든 걱정과 두려움을 기도로 바꾸어보세요. 주님께서 세상이 줄 수 없는 평안으로 당신의 마음과 생각을 지키실 것입니다. 두려워하지 마세요, 주님이 당신의 오른손을 붙들고 계십니다.",
        praises: [
            { title: "아무것도 염려하지 말고", link: "https://www.youtube.com/results?search_query=아무것도+염려하지+말고+찬양" },
            { title: "평안을 너에게 주노라", link: "https://www.youtube.com/results?search_query=평안을+너에게+주노라+찬양" },
            { title: "내 모습 이대로", link: "https://www.youtube.com/results?search_query=내+모습+이대로+찬양" }
        ]
    },
    {
        keyword: ['감사', '기쁨', '행복', '즐거움'],
        verse: {
            text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라",
            reference: "데살로니가전서 5:16-18"
        },
        comfortMessage: "당신의 마음에 감사가 넘치니 참으로 아름답습니다! 작은 일에도 감사할 줄 아는 당신의 믿음이 하나님을 기쁘시게 합니다. 오늘의 이 기쁨과 감사가 당신의 삶에 마르지 않는 샘물이 되기를 축복합니다. 감사는 더 큰 감사를 불러오는 기적의 씨앗입니다. 이 행복한 마음을 이웃과 함께 나누며 하나님의 사랑을 전하는 하루 되세요.",
        praises: [
            { title: "감사함으로 (마커스)", link: "https://www.youtube.com/results?search_query=마커스+감사함으로" },
            { title: "은혜 (손경민)", link: "https://www.youtube.com/results?search_query=손경민+은혜" },
            { title: "지금까지 지내온 것", link: "https://www.youtube.com/results?search_query=지금까지+지내온+것" }
        ]
    },
    {
        keyword: ['감사', '은혜', '찬양', '고백'],
        verse: {
            text: "여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다",
            reference: "시편 136:1"
        },
        comfortMessage: "주님의 선하심을 맛보아 아는 당신에게 축복이 있습니다. 우리 삶의 모든 순간이 하나님의 은혜임을 고백할 때, 더 큰 감사의 문이 열립니다. 영원토록 변치 않는 주님의 사랑을 찬양하며, 오늘도 기쁨으로 가득한 하루 되시길 소망합니다.",
        praises: [
            { title: "감사해 (제이어스)", link: "https://www.youtube.com/results?search_query=제이어스+감사해" },
            { title: "은혜 아니면 (마커스)", link: "https://www.youtube.com/results?search_query=마커스+은혜+아니면" },
            { title: "오직 예수 뿐이네", link: "https://www.youtube.com/results?search_query=오직+예수+뿐이네+마커스" }
        ]
    },
    {
        keyword: ['감사', '평안', '축복'],
        verse: {
            text: "그리스도의 평강이 너희 마음을 주장하게 하라 너희는 평강을 위하여 한 몸으로 부르심을 받았나니 너희는 또한 감사하는 자가 되라",
            reference: "골로새서 3:15"
        },
        comfortMessage: "감사는 평안을 부르는 열쇠입니다. 혹시 마음에 작은 소란이 일더라도, 감사를 선택할 때 그리스도의 평강이 당신의 마음을 지키실 것입니다. 주님이 주신 평안 안에서 오늘도 넉넉한 마음으로 감사의 열매를 맺으시길 축복합니다.",
        praises: [
            { title: "날 구원하신 주 감사", link: "https://www.youtube.com/results?search_query=날+구원하신+주+감사" },
            { title: "감사로 제사 드리는 자", link: "https://www.youtube.com/results?search_query=감사로+제사+드리는+자" },
            { title: "주님께 감사해", link: "https://www.youtube.com/results?search_query=주님께+감사해" }
        ]
    },
    {
        keyword: ['회개', '죄', '용서', '미안'],
        verse: {
            text: "만일 우리가 우리 죄를 자백하면 그는 미쁘시고 의로우사 우리 죄를 사하시며 우리를 모든 불의에서 깨끗하게 하실 것이요",
            reference: "요한일서 1:9"
        },
        comfortMessage: "주님 앞에 나아와 솔직하게 마음을 여시는 당신의 용기가 귀합니다. 우리는 연약하여 넘어지지만, 주님은 그런 우리를 결코 정죄하지 않으십니다. 십자가의 보혈로 당신의 모든 허물을 덮으시고 '내가 너를 정결케 하노라' 말씀하십니다. 죄책감에서 벗어나 주님이 주시는 자유와 용서의 평안을 깊이 누리시길 바랍니다.",
        praises: [
            { title: "정결한 맘 주시옵소서", link: "https://www.youtube.com/results?search_query=정결한+맘+주시옵소서+찬양" },
            { title: "주님 다시 오실 때까지", link: "https://www.youtube.com/results?search_query=주님+다시+오실+때까지" },
            { title: "우물가의 여인처럼", link: "https://www.youtube.com/results?search_query=우물가의+여인처럼" }
        ]
    },
    {
        keyword: ['사랑', '외로움', '고독'],
        verse: {
            text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
            reference: "요한복음 3:16"
        },
        comfortMessage: "세상에 홀로 남겨진 것 같은 외로움이 찾아올 때, 기억하세요. 당신은 하나님의 눈에 넣어도 아프지 않을 존귀한 자녀입니다. 사람의 사랑은 변할지라도, 당신을 향한 하나님의 사랑은 영원토록 변지 않습니다. 지금 이 순간도 당신을 따스하게 바라보시는 주님의 시선을 느끼며, 그 크신 사랑 안에서 위로 얻으시길 기도합니다.",
        praises: [
            { title: "하나님의 사랑이", link: "https://www.youtube.com/results?search_query=하나님의+사랑이+찬양" },
            { title: "당신은 사랑받기 위해 태어난 사람", link: "https://www.youtube.com/results?search_query=당신은+사랑받기+위해+태어난+사람" },
            { title: "사랑합니다 나의 예수님", link: "https://www.youtube.com/results?search_query=사랑합니다+나의+예수님" }
        ]
    },
    {
        keyword: ['소망', '비전', '꿈', '미래'],
        verse: {
            text: "너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라",
            reference: "예레미야 29:11"
        },
        comfortMessage: "앞이 보이지 않는 막막한 상황에서도 소망을 잃지 않는 당신을 축복합니다. 지금은 긴 터널을 지나는 것 같아도, 그 끝에는 반드시 주님이 예비하신 밝은 빛이 있습니다. 하나님은 당신을 향한 놀라운 계획을 가지고 계십니다. 주님의 때에 주님의 방법으로 가장 선하게 인도하실 것을 믿으며, 믿음의 발걸음을 내딛으시기 바랍니다.",
        praises: [
            { title: "원하고 바라고 기도합니다", link: "https://www.youtube.com/results?search_query=원하고+바라고+기도합니다+찬양" },
            { title: "주님 말씀하시면", link: "https://www.youtube.com/results?search_query=주님+말씀하시면" },
            { title: "행복 (화려하지 않아도)", link: "https://www.youtube.com/results?search_query=화려하지+않아도+정대로" }
        ]
    }
];

export const getRandomRecommendation = () => {
    return recommendations[Math.floor(Math.random() * recommendations.length)];
};

export const getRecommendationByKeyword = (input: string) => {
    // Simple keyword matching
    const matched = recommendations.filter(rec =>
        rec.keyword.some(k => input.includes(k))
    );

    if (matched.length > 0) {
        // Return a random match if multiple keywords match
        return matched[Math.floor(Math.random() * matched.length)];
    }

    return null; // No match found
};
