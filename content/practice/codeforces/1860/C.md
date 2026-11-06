---
title: "CF 1860C - 排列游戏"
description: "我们得到了一个排列，并在其位置上进行了游戏。 芯片无处启动。 爱丽丝首先选择任意位置并将芯片放置在那里。 之后，玩家轮流移动筹码。"
date: "2026-06-09T00:22:08+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "games", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1860
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 153 (Rated for Div. 2)"
rating: 1400
weight: 1860
solve_time_s: 116
verified: false
draft: false
---

[CF 1860C - 排列游戏](https://codeforces.com/problemset/problem/1860/C)

 **评分：** 1400
 **标签：** 数据结构、dp、游戏、贪婪
 **求解时间：** 1m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个排列，并在其位置上进行了游戏。 

芯片无处启动。 爱丽丝首先选择任意位置并将芯片放置在那里。 之后，玩家轮流移动筹码。 从位置`i`，芯片只能移动到一个位置`j`这样`j < i`和`p[j] < p[i]`。 换句话说，每次移动都会向左移动，并且也会达到一个严格较小的值。 

游戏的不同寻常之处在于获胜条件。 如果玩家无法采取行动，则该玩家立即获胜。 这与标准的正常游戏规则相反。 

对于排列的每个位置，我们必须确定选择该位置作为初始位置是否可以保证 Alice 获胜，而不管 Bob 的决定如何。 这样的位置被称为幸运。 答案是幸运位置的数量。 

排列大小可达`3 · 10^5`跨所有测试用例。 任何从每个起始位置单独分析游戏图的解决方案都太慢了。 由于总输入大小只有几十万个元素，因此我们需要接近线性或`O(n log n)`。 

微妙的一点是获胜条件的逆转。 在普通的公正游戏中，终端位置会因为当前玩家无法移动而丢失。 在这里，终端位置获胜，因为无法立即移动，游戏就会以对你有利的方式结束。 关于
