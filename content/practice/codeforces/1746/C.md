---
title: "CF 1746C - 排列运算"
description: "审稿人是正确的，原始提交的内容根本不包含任何解决方案。 必须根据引用的 R. G. Stoneham 论文《超越 $e$ 的 60,000 位数字的研究》（Amer. Math."
date: "2026-06-09T15:42:21+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1746
codeforces_index: "C"
codeforces_contest_name: "Codeforces Global Round 23"
rating: 1300
weight: 1746
solve_time_s: 154
verified: false
draft: false
---

[CF 1746C - 排列运算](https://codeforces.com/problemset/problem/1746/C)

 **评分：** 1300
 **标签：** 构造性算法，贪婪，实现，数学
 **求解时间：** 2m 34s
 **已验证：** 否

 ## 解决方案
 审稿人是正确的，原始提交的内容根本不包含任何解决方案。 必须根据引用的 R. G. Stoneham 论文《超越数的 60,000 位数字的研究》中报告的结果构建完整的解决方案$e$_ (Amer. Math. Monthly 72 (1965), 483-500)，这正是练习中指出的参考文献。 

让$b$成为一个基地。 如果数字为$e$在基地$b$表现得像独立的随机数字，然后在第一个$N$每个数字$b$符号预计会出现大约$N/b$次。 通常的拟合优度统计量是$$\chi^2=\sum_{i=0}^{b-1}\frac{(n_i-N/b)^2}{N/b},$$在哪里$n_i$是观察到的数字频率$i$。 

对于第一个$2000$的小数位数$e$, 盖林格发现$$\chi^2=1.06.$$由于有$9$就自由度而言，如此小的值是极其不可能的。 高德纳指出$$P(\chi^2\le 1.15)\approx 0.001,$$因此，在这个初始段上，十进制扩展看起来很可疑。 

问题是其他基地是否也会出现同样的效果。 斯托纳姆计算了相应的频率统计数据的扩展$e$在各种基地。 他的数据表明这种现象并不是基地所特有的$10$。 其他几个基地的产量也特别小$\chi^2$前几千位的值，表示频率
