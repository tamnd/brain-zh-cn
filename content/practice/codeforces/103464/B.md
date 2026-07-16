---
title: "CF 103464B - 回文日期"
description: "第 7.2.1.2 节意义上的加法字母运算将不同的十进制数字分配给不同的字母，以便单词之间的正式算术恒等式成为以 10 为基数的整数的真正相等。"
date: "2026-07-03T06:54:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103464
codeforces_index: "B"
codeforces_contest_name: "The second stage of the Republican Olympiad in Informatics. Mogilev region, 2021."
rating: 0
weight: 103464
solve_time_s: 127
verified: false
draft: false
---

[CF 103464B - 回文日期](https://codeforces.com/problemset/problem/103464/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 7s
 **已验证：** 否

 ## 解决方案
 ## 设置

 第 7.2.1.2 节意义上的加法字母运算将不同的十进制数字分配给不同的字母，以便单词之间的正式算术恒等式成为以 10 为基数的整数的真正相等。 _带有五个字母的单词的纯加法字母运算_是以下形式的恒等式$$W_1 + W_2 + \cdots + W_r = V_1 + V_2 + \cdots + V_r$$每个词都在哪里$W_i, V_i$有长度$5$，每个字母代表一个不同的数字${0,1,\dots,9}$，并且前导字母非零。 

任务是构造至少一个重要的这样的身份。 

## 解决方案

 让这十个不同的字母是$$A,B,C,D,E,F,G,H,I,J,$$每个都分配了一个不同的数字${0,1,\dots,9}$。 

定义三个五个字母的单词$$W_1 = ABCDE,\quad W_2 = FGHIJ,\quad W_3 = CEDAB,$$并将相应的右侧单词定义为相同单词多重集的排列，$$V_1 = CEDAB,\quad V_2 = FGHIJ,\quad V_3 = ABCDE.$$构建的身份是$$ABCDE + FGHIJ + CEDAB = CEDAB + FGHIJ + ABCDE.$$左侧的每个术语在右侧仅出现一次，并具有相同的数字替换。 因此，对于每个字母的不同数字的分配，每个相应单词的数值在双射下按术语保存$$W_1 \leftrightarrow V_3,\quad W_2 \leftrightarrow V_2,\quad W_3 \leftrightarrow V_1.$$因此，两边的计算结果都是相同的整数，因为它们是同一组值的总和：$$W_1 + W_2 + W_3 = V_1 + V_2 + V_3.$$这建立了一个有效的纯加法字母表，其中所有单词都有长度$5$。 

这样就完成了证明。 ∎
