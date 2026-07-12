---
title: "CF 103274A - 外星作物三角形"
description: "对偶形式的 $(s,t)$ 组合是严格递减序列 $bs b{s-1} cdots b1 ge 0,$，其中 ${b1,dots,bs}$ 正是长度为 $n=s+t$ 的二进制字符串中 $0$ 的位置。 元组 $(bs,dots,b1)$ 的字典顺序从左到右比较条目。"
date: "2026-07-03T14:36:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103274
codeforces_index: "A"
codeforces_contest_name: "2021 ICPC Gran Premio de Mexico 1ra Fecha"
rating: 0
weight: 103274
solve_time_s: 143
verified: false
draft: false
---

[CF 103274A - 外星作物三角形](https://codeforces.com/problemset/problem/103274/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 23s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 安$(s,t)$-对偶形式的组合是严格递减序列$b_s > b_{s-1} > \cdots > b_1 \ge 0,$在哪里${b_1,\dots,b_s}$正是的位置$0$是一个长度为二进制的字符串$n=s+t$。 

元组的字典顺序$(b_s,\dots,b_1)$从左到右比较条目。 因此，递减词典扫描首先生成具有最大第一个条目的元组，并且通常会更改可能的最早坐标； 后面的坐标始终保持在约束允许的范围内尽可能大。 

最大的有效元组是$b_s=n-1,\quad b_{s-1}=n-2,\quad \dots,\quad b_1=n-s,$因为这是具有最大可能条目的唯一递减序列。 

要按字典顺序递减移动到下一个元组，目标是减少$b_s$尽可能长。 这是可行的，同时$b_s > b_{s-1}+1$。 什么时候$b_s = b_{s-1}+1$，不再减少$b_s$保持严格性，所以$b_s$必须重置为与固定前缀兼容的最大值$(b_{s-1},\dots)$后$b_{s-1}$被改变了。 相同的逻辑递归地适用于较早的位置。 

这导致从右到左搜索可以减少的第一个索引，并恢复其右侧的最大值。 

引入哨兵$b_0=-1,\qquad b_{s+1}=n.$### 算法 D（按字典顺序递减的双重组合）

 D1。 [初始化。] 设置$b_j \leftarrow n-j$为了$1 \le j \le s$。 

D2。 [访问。] 访问$(b_s,\dots,b_1)$。 

D3。 [查找位置。] 设置$j \leftarrow s$。 尽管$b_j = b_{j-1}+1$， 放$b_j \leftarrow n-j$和$j \leftarrow j-1$。 

D4。 [完成？] 如果$j=0$，终止。 

D5。 [减少并填充。] 设置$b_j \leftarrow b_j - 1$。 为了$k$从$1$到$j-1$， 放$b_k \leftarrow b_{k+1}-1.$返回D2。 

初始化产生按字典顺序最大的有效元组，因为每个$b_j$选择尽可能大的同时保持严格的减少。 

在步骤D3中，每个索引$j$满意的$b_j=b_{j-1}+1$正是一个位置$b_j$处于给定当前后缀的最小允许值； 替换$b_j \leftarrow n-j$恢复与早期指数未来下降一致的最大值。 扫描停止在第一个位置$j$如果减少是可行的，这意味着$b_j > b_{j-1}+1$。 

步骤D5执行字典顺序下一个较小的选择$j$通过减少$b_j$经过$1$，然后强制后缀成为与新前缀兼容的最大递减补全。 复发$b_k=b_{k+1}-1$唯一地重建位置右侧的最大严格递减序列$j$。 

每个转换都会更改字典顺序上最早的可能坐标，同时保持右侧的最大完成度，这确保不会跳过任何元组，也不会重复任何元组。 

这样就完成了证明。 ∎
