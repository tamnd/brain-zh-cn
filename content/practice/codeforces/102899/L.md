---
title: "CF 102899L - KK \u5b66\u4e94\u5b50\u68cb"
description: "设$U$表示满足(6)的所有多重组合$dt ldots d2 d1$的集合，即$$s ge dt ge cdots ge d2 ge d1 ge 0。$$提示中描述的补运算是$U$上由相对于$s$的反转和互补引起的标准对合。"
date: "2026-07-04T08:23:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102899
codeforces_index: "L"
codeforces_contest_name: "The 2nd Hangzhou Normal University Freshman Programming Contest"
rating: 0
weight: 102899
solve_time_s: 64
verified: false
draft: false
---

[CF 102899L - KK \u5b66\u4e94\u5b50\u68cb](https://codeforces.com/problemset/problem/102899/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 4s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$U$表示所有多重组合的集合$d_t \ldots d_2 d_1$满足(6)式，即$$s \ge d_t \ge \cdots \ge d_2 \ge d_1 \ge 0.$$提示中描述的补运算是标准的对合运算$U$由逆转和互补引起$s$。 对于每个$d = d_t \ldots d_1 \in U$，定义其补集$d^\ast = d_t^\ast \ldots d_1^\ast$经过$$d_j^\ast = s - d_{t+1-j}, \qquad 1 \le j \le t.$$自从$0 \le d_{t+1-j} \le s$， 每个$d_j^\ast$在于${0,1,\ldots,s}$。 不平等现象$$d_{t+1-j} \ge d_{t-j}$$意味着$$s - d_{t+1-j} \le s - d_{t-j},$$所以$$d_j^\ast \ge d_{j+1}^\ast,$$哪些地方$d^\ast$再次在$U$。 应用变换两次会返回原始序列，因为$$(d^\ast)_j^\ast = s - d^\ast_{t+1-j} = s - (s - d_j) = d_j.$$因此映射是对$U$。 

对于提示中所示的情况，以下元素$U$是$4$- 包含条目的元组${0,1,2,3}$按非递增顺序，补码操作反转列表并替换每个条目$x$经过$3-x$。 这会产生列出的对$$3211 \leftrightarrow 1100,\quad 3210 \leftrightarrow 2100,\quad \ldots,\quad 3000 \leftrightarrow 0003,$$这解释了提示中所述的所有补充。 

推论 C 将多重组合族分成两个互补部分，这两个部分由条目的阈值条件确定。 两半通过对合交换$d \mapsto d^\ast$，因为反转并替换每个条目$d_j$经过$s-d_{t+1-j}$转换形式的任何条件$d_1 \le k$进入互补条件$d_t \ge s-k$，对于定义后半部分的任何极端条件也类似。 

因此“中的每个元素$\partial$推论 C 的“half”被双射映射到下一个补半的元素上$d \mapsto d^\ast$，反之亦然。 因此，两半具有相等的基数，并且通过应用这种对合，为一半建立的任何恒等式立即转移到另一半。 

这样就完成了证明。 ∎
