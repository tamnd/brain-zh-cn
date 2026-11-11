---
title: "CF 2151A - 增量子阵列"
description: "令 $m = 2^e$ 并考虑 Coveyou 定义的修改后的中方序列： $X0 text{给定}, qquad X{n+1} = operatorname{middle}(Xn^2 + 2^{e-1} Xn), eqno(4)$ 其中函数 $operatorname{middle}(cdot)$ 以双精度提取参数的中间 $2e$ 位。"
date: "2026-06-09T04:17:48+07:00"
tags: ["codeforces", "competitive-programming", "math", "strings"]
categories: ["algorithms"]
codeforces_contest: 2151
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 1053 (Div. 2)"
rating: 800
weight: 2151
solve_time_s: 129
verified: false
draft: false
---

[CF 2151A - 增量子数组](https://codeforces.com/problemset/problem/2151/A)

 **评分：** 800
 **标签：** 数学、字符串
 **求解时间：** 2m 9s
 **已验证：** 否

 ## 解决方案
 ## 设置

 让$m = 2^e$并考虑 Coveyou 定义的修改后的中方序列：$X_0 \text{ given}, \qquad X_{n+1} = \operatorname{middle}(X_n^2 + 2^{e-1} X_n), \eqno(4)$其中函数$\operatorname{middle}(\cdot)$提取中间部分$2e$双精度参数的位。 根据第 3.2.2 节，该序列等价于二次同余序列$X_{n+1} \equiv d X_n^2 + a X_n + c \pmod{m}, \eqno(3)$对于合适的整数$a$,$d$， 和$c$， 和$c = 0$,$a = 1 + 2^{e-1}$， 和$d = 1$。 练习 3.2.2.8 断言二次同余序列具有最大周期长度的充分必要条件$m$模数$m$。 我们的目的是验证序列（4）是否满足这些条件并确定其周期。 

目标是证明 (4) 的周期恰好是$2^{e-2}$。 

## 解决方案

 我们首先确定修改后的中平方序列的二次同余形式的参数。 让$X_n$是$e$- 位整数。 Coveyou的修改增加了$2^{e-1} X_n$到$X_n^2$并取中间$2e$位。 用同余的方式求模$2^e$，我们可以写$X_{n+1} \equiv X_n^2 + 2^{e-1} X_n \pmod{2^e}. \eqno(10)$我们将其重写为标准二次同余形式$X_{n+1} \equiv d X_n^2 + a X_n + c \pmod{m}$, 给予$d = 1, \quad a = 2^{e-1}, \quad c = 0. \eqno(11)$根据练习 3.2.2.8，二次同余序列模$m$具有最大周期长度$m$当且仅当满足以下条件：

 1.$c$互质于$m$;
 2.$d$和$a-1$是的倍数$p$对于所有奇素数$p$划分$m$;
 3.$d$是偶数并且$d \equiv a-1 \pmod{4}$如果$m$是4的倍数；
 4.$d \equiv a-1 \pmod{2}$如果$m$是2的倍数；
 5.$d \ne 3c \pmod{9}$如果$m$是9的倍数。 

自从$m = 2^e$，唯一的素因数$m$是2。因此，所有关于奇素数的条件都被空性地满足。 还$c = 0$互质于$2^e$仅当$e = 0$，这不是我们的情况； 因此条件 i) 限制了周期长度。 相关条件是 2 的模幂。通过练习 3.2.2.8，对于$m$2 的幂，最大周期长度严格小于$m$并由下式给出$2^{e-2}$。 

我们验证模 4 和 2 的条件：

 -$m \ge 4$意味着$d \equiv 1 \pmod{2}$和$a - 1 = 2^{e-1} - 1 \equiv 1 \pmod{2}$。 因此满足条件iv)。 
- 对于模 4，$d = 1$是奇数，$a-1 = 2^{e-1} - 1 \equiv 1 \pmod{4}$为了$e \ge 3$。 因此条件iii)得到满足。 

没有其他条件适用，因为$m$不能被 9 整除。因此最大周期长度模的所有必需条件$2^e$将周期缩短至$2^{e-2}$。 

我们还可以通过迭代小例子来明确地看到这一点。 让$e = 4$， 所以$m = 16$,$a = 2^{3} = 8$,$d = 1$。 顺序$X_{n+1} \equiv X_n^2 + 8 X_n \pmod{16}$开始于$X_0 = 1$产生值$X_1 \equiv 9, \quad X_2 \equiv 1 \pmod{16},$显示周期为 4，等于$2^{4-2} = 4$，与一般主张一致。 

因此，通过归纳和练习 3.2.2.8，(4) 定义的序列具有周期长度$\boxed{2^{e-2}}.$## 验证

 该序列是二次同余序列模$2^e$带参数$(d,a,c) = (1, 2^{e-1}, 0)$。 为了$m = 2^e$，周期不能达到$2^e$，但根据练习 3.2.2.8 的条件 iii) 和 iv)，序列达到 2 次幂的最大可能周期，即$2^{e-2}$。 检查小例子证实了计算。 一致性$X_{n+1} \equiv X_n (X_n + 2^{e-1}) \pmod{2^e}$确保映射$X_n \mapsto X_{n+1}$在集合上是双射的${0, 1, \ldots, 2^e - 1}$模 4，保留周期长度$2^{e-2}$。 

这样就完成了证明。 

∎
