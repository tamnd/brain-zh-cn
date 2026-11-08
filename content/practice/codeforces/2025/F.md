---
title: "CF 2025F - 选择您的查询"
description: "对于 $n$ 次多项式 $f$，定义 $Fk(x)=sum{j=0}^{k}f(x+j).$ 对 $k$ 的依赖性由 Faulhaber 公式描述。"
date: "2026-06-09T03:15:15+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "dp", "graphs", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 2025
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 170 (Rated for Div. 2)"
rating: 2700
weight: 2025
solve_time_s: 129
verified: false
draft: false
---

[CF 2025F - 选择您的查询](https://codeforces.com/problemset/problem/2025/F)

 **评分：** 2700
 **标签：** 构造性算法、dfs 和类似算法、dp、图、贪婪、树
 **求解时间：** 2m 9s
 **已验证：** 否

 ## 解决方案
 ## 探索

 对于多项式$f$学位的$n$， 定义$F_k(x)=\sum_{j=0}^{k}f(x+j).$依赖于$k$由 Faulhaber 公式描述。 如果$f(t)=a_nt^n+a_{n-1}t^{n-1}+\cdots,$然后$$=\frac{(x+k)^{n+1}-x^{n+1}}{n+1} +O(k^n),$$统一为$x$其长度正比于的间隔$k$。 

这建议引入重新调整的变量$$\qquad G_k(y)=\frac{F_k(ky)}{k^{n+1}}.$$然后这些和就变成了黎曼和，人们期望$$=\frac{a_n}{n+1}\bigl((y+1)^{n+1}-y^{n+1}\bigr).$$极限多项式是明确的。 可以直接分析其实零点。 

## 问题理解

 任务是证明存在合适的$k$。 

对于甚至$\deg f=n$，我们必须证明一些$F_k$没有真正的根源。 

对于奇数$\deg f=n$，我们必须证明一些$F_k$仅有一个实根。 

中心观察是，缩放后$k$，归一化多项式$F_k(ky)/k^{n+1}$方法$$$$自从$n+1$具有相反的奇偶性$n$，根结构$H$很简单，可以转移到$G_k$对于足够大的$k$。 

## 证明架构

 We first establish the asymptotic limit$$\longrightarrow H(y) =\frac{a_n}{n+1}\bigl((y+1)^{n+1}-y^{n+1}\bigr),$$在每个有界区间上一致。 

然后我们分析$H$。 

如果$n$是偶数，那么$n+1$很奇怪。 等式$(y+1)^{n+1}-y^{n+1}=0$意味着$(y+1)^{n+1}=y^{n+1}.$自从$n+1$是奇数，函数$t\mapsto t^{n+1}$是单射的$\mathbb R$， 因此$y+1=y$， 不可能的。 因此$H$没有真正的根源。 

如果$n$是奇数，那么$n+1$是均匀的。 等式$(y+1)^{n+1}=y^{n+1}$给出$|y+1|=|y|,$其唯一的实数解是$y=-\frac12.$而且这个根很简单，因为$$=a_n\bigl((y+1)^n-y^n\bigr),$$和$$=a_n\left(\left(\frac12\right)^n-\left(-\frac12\right)^n\right) \neq0$$自从$n$很奇怪。 

因此$H$恰好有一个简单的实根。 

那么均匀收敛意味着对于足够大的$k$，多项式$G_k$具有相同数量的实根$H$。 重新缩放从$G_k$到$F_k$保留根的数量。 

## 解决方案

 让$$\qquad a_n\neq0.$$定义$$$$和$$$$写$$= a_n(ky+j)^n + O(k^{n-1}),$$统一为$y$在任何固定有界区间内并且对于$0\le j\le k$。 

因此$$G_k(y) = a_n\frac1k \sum_{j=0}^{k} \left(y+\frac{j}{k}\right)^n +O\!\left(\frac1k\right).$$第一项是黎曼和。 因此，在每个有界区间上一致，$$G_k(y) \longrightarrow a_n\int_0^1 (y+t)^n\,dt = \frac{a_n}{n+1} \bigl((y+1)^{n+1}-y^{n+1}\bigr).$$将极限多项式表示为$$H(y) = \frac{a_n}{n+1} \bigl((y+1)^{n+1}-y^{n+1}\bigr).$$### 第 1 部分

 假设$n$是均匀的。 

然后$n+1$很奇怪。 如果$H(y)=0$， 然后$$(y+1)^{n+1}=y^{n+1}.$$自从$n+1$地图很奇怪$t\mapsto t^{n+1}$是严格单调的，所以$y+1=y$， 不可能的。 

因此$H$没有真正的根源。 

自从$H$是连续的，永不消失，存在$c>0$这样$$|H(y)|\ge c$$为所有人$y$在足够大的区间内$[-R,R]$。 均匀收敛给出$$|G_k(y)-H(y)|<c/2$$对于所有足够大的$k$， 因此$G_k$无根于$[-R,R]$。 

在该区间之外，$H$保持固定符号并具有相同的增长$y^n$。 系数的均匀收敛意味着对于足够大的$k$，同样的符号仍然存在$G_k$。 最后$G_k$根本没有真正的根源。 

自从$$G_k(y)=\frac{F_k(ky)}{k^{n+1}},$$多项式$F_k$也没有真正的根源。 

### 第 2 部分

 假设$n$很奇怪。 

然后$n+1$是均匀的。 等式$$H(y)=0$$相当于$$|y+1|=|y|,$$其独特的解决方案是$$y_0=-\frac12.$$此外，$$H'(y) = a_n\bigl((y+1)^n-y^n\bigr),$$和$$H'(y_0) = a_n\left( \left(\frac12\right)^n - \left(-\frac12\right)^n \right) \neq0.$$因此$y_0$是一个简单的根，并且是唯一的实根$H$。 

选择一个小邻域$y_0$不包含其他零$H$。 均匀收敛意味着对于足够大的$k$，多项式$G_k$在该社区中只有一个真正的根。 小区外，$H$保持远离$0$，所以一致收敛表明$G_k$没有额外的实根。 

因此对于足够大的$k$,$G_k$仅有一个实根。 

重新缩放自$G_k$回到$F_k$保留实根的数量，因为$$G_k(y)=0 \iff F_k(ky)=0.$$所以$F_k$仅有一个实根。 

两种说法都得到证明。 ∎
