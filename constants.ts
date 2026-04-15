/**
 * Relationship Special Days
 */
export interface SpecialDay {
  name: string;
  month: number; // 0-indexed (0 = Jan, 1 = Feb, ...)
  day: number;
}

export const SPECIAL_DAYS: SpecialDay[] = [
  { name: "Spouses Day", month: 0, day: 26 },
  { name: "Rose Day", month: 1, day: 7 },
  { name: "Propose Day", month: 1, day: 8 },
  { name: "Chocolate Day", month: 1, day: 9 },
  { name: "Teddy Day", month: 1, day: 10 },
  { name: "Promise Day", month: 1, day: 11 },
  { name: "Hug Day", month: 1, day: 12 },
  { name: "Kiss Day", month: 1, day: 13 },
  { name: "Valentine's Day", month: 1, day: 14 },
  { name: "Proposal Day", month: 2, day: 20 },
  { name: "Husband Appreciation Day", month: 3, day: 19 },
  { name: "Kissing Day", month: 5, day: 22 },
  { name: "World Kiss Day", month: 6, day: 6 },
  { name: "Girlfriend Day", month: 7, day: 1 },
  { name: "Hug Your Sweetheart Day", month: 8, day: 3 },
  { name: "International Day of Love", month: 8, day: 12 },
  { name: "Wife Appreciation Day", month: 8, day: 18 },
  { name: "Love Note Day", month: 8, day: 26 },
  { name: "Boyfriend Day", month: 9, day: 3 },
  { name: "National I Love You Day", month: 9, day: 14 },
  { name: "Sweetest Day", month: 9, day: 19 },
];

/**
 * Romantic Messages Generator
 * Generates 10,000+ unique messages using combinations of heartfelt phrases.
 */
export const LOVE_MESSAGES: string[] = (() => {
  const openers = [
    "My dearest love,", "To my beautiful girl,", "Sweetheart,", "My soulmate,", "To the love of my life,",
    "My darling,", "To my one and only,", "My precious,", "To the most amazing woman,", "My angel,",
    "To my better half,", "My sunshine,", "To my queen,", "My heart's desire,", "To the girl who has my heart,",
    "My love,", "To my forever person,", "My treasure,", "To the most beautiful soul,", "My everything,",
    "To the woman of my dreams,", "My heart,", "To my sweet angel,", "My beloved,", "To my partner in crime,",
    "My light,", "To the girl who changed my life,", "My world,", "To my constant inspiration,", "My soul's twin,"
  ];

  const middles = [
    "every moment spent with you is like a beautiful dream come true.",
    "your smile is the only light I need to find my way through the darkest days.",
    "I am constantly amazed by the kindness and grace you show the world.",
    "being with you has taught me what it truly means to love and be loved.",
    "I find myself falling for you more and more with every single heartbeat.",
    "you are the missing piece I never knew I was looking for until I found you.",
    "the way you look at me makes me feel like the luckiest person in the universe.",
    "your laughter is my favorite melody and your arms are my favorite home.",
    "I promise to cherish you, support you, and stand by you through everything.",
    "you have a way of making even the simplest moments feel extraordinary.",
    "my life became infinitely more beautiful the second you walked into it.",
    "I love the way we can talk for hours or just sit in beautiful silence together.",
    "your love is the greatest gift I have ever received, and I'll protect it forever.",
    "I can't wait to build a lifetime of memories and adventures by your side.",
    "you are my best friend, my confidante, and my greatest inspiration.",
    "the world is a much brighter place just because you are in it.",
    "I am so proud of the person you are and the person you are becoming.",
    "no matter where life takes us, my heart will always belong to you.",
    "you make me want to be a better person every single day.",
    "I am so grateful for the love we share and the life we are building.",
    "thinking of you is the highlight of my day, every single day.",
    "your presence in my life is a blessing that I will never take for granted.",
    "I love how you understand me in ways that no one else ever could.",
    "every day with you feels like a new adventure in the most beautiful way.",
    "you are the reason I wake up with a smile and go to sleep with a full heart.",
    "I am captivated by your beauty, both on the inside and the outside.",
    "your strength and resilience inspire me to be the best version of myself.",
    "I love the way your hand fits perfectly in mine, like it was meant to be there.",
    "you are the melody in my heart and the peace in my soul.",
    "I am so lucky to have you as my partner, my lover, and my best friend."
  ];

  const closers = [
    "I love you more than words could ever express.",
    "Forever and always, you are mine.",
    "You are my everything, now and forever.",
    "I am yours, completely and eternally.",
    "Thank you for being you.",
    "I can't wait for our next chapter together.",
    "You mean the world to me.",
    "My heart is yours, always.",
    "I love you to the moon and back.",
    "You are my greatest blessing.",
    "Always yours,",
    "With all my love,",
    "Yours forever,",
    "To infinity and beyond,",
    "My heart belongs to you.",
    "I will love you until the end of time.",
    "You are my forever and always.",
    "I am so blessed to call you mine.",
    "My love for you grows stronger every day.",
    "You are the best thing that ever happened to me.",
    "I love you more than life itself.",
    "You are my home and my heart.",
    "Forever isn't long enough to love you.",
    "My heart beats only for you.",
    "I am yours forevermore."
  ];

  const result: string[] = [];
  
  // Generate combinations (30 * 30 * 25 = 22,500 unique messages)
  for (const o of openers) {
    for (const m of middles) {
      for (const c of closers) {
        result.push(`${o} ${m} ${c}`);
      }
    }
  }

  // Shuffle to ensure variety
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
})();
