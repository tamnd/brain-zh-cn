---
title: "CF 1521A - Nastia 和几乎不错的数字"
description: "基数转换例程将以一种基数编写的非负整数转换为另一种基数的表示形式。 正在讨论的程序是第 4 节中的方法 1a。"
date: "2026-06-10T17:46:57+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1521
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 720 (Div. 2)"
rating: 1000
weight: 1521
solve_time_s: 131
verified: false
draft: false
---

[CF 1521A - Nastia 和几乎不错的数字](https://codeforces.com/problemset/problem/1521/A)

 **评分：** 1000
 **标签：** 构造性算法、数学、数论
 **求解时间：** 2m 11s
 **已验证：** 否

 ## 解决方案
 ## 设置

 基数转换例程将以一种基数编写的非负整数转换为另一种基数的表示形式。 正在讨论的程序是 4.4 节中的方法 1a，它生成整数的数字$u$以基数表示$B$通过重复除以$B$在原始基数中$b$。 具体来说，它生成数字$U_0, U_1, U_2, \ldots$这样$$u = (\ldots U_2 U_1 U_0)_B,$$其中每个数字都是通过连续的商和余数运算获得的$$U_0 = u \bmod B,\quad U_1 = \lfloor u/B \rfloor \bmod B,\quad \ldots$$直到商变为零。 

该练习要求证明该方法的 MIX 实现在常量$10$除法指令中的被替换为更通用的常数$c$，前提是保留程序的算术解释。 

本质主张是该算法不依赖于具体的十进制基数，而仅依赖于商余数分解的正确性$$u = qB + r,\quad 0 \le r < B.$$## 解决方案

 等式（1）中的程序执行重复除法$B = 10$，每次提取余数作为下一个基数-$10$数字。 迭代中保持的关键不变量是在每个循环开始时，寄存器对$(rA, rX)$存储当前值$u^{(j)}$，执行除法步骤后，该值被分解为$$u^{(j)} = 10 q^{(j)} + r^{(j)}, \quad 0 \le r^{(j)} < 10,$$以便$r^{(j)}$被存储为下一个输出数字并且$q^{(j)}$成为下一个要处理的值。 

正确性参数仅使用 MIX 中的除法产生满足商和余数的属性$$rAX = Bq + r,\quad 0 \le r < B.$$如果指令`DIV =10=`被替换为`DIV =c=`，机器计算$$rAX = cq + r,\quad 0 \le r < c,$$所以循环现在提取基数中的数字$c$而不是基础$10$。 算法的每一步都继续保持相同的结构不变量：之后$j$迭代，存储在工作寄存器中的值等于$$\left\lfloor \frac{u}{c^j} \right\rfloor,$$发射的余数正好是$$U_j = \left\lfloor \frac{u}{c^j} \right\rfloor \bmod c.$$由于基数表示是通过重复提取这种形式的余数来唯一定义的，因此程序计算基数$c$的扩展$u$。 

程序的其他部分不依赖于该常量$10$除非作为商余数分解中使用的除数。 因此代入任意固定整数$c \ge 2$保留正确性，并且仅更改输出表示的基数。 

这样就完成了证明。 ∎

 ## 验证

 正确性取决于 MIX 算术中必须同时成立的两个独立条件。 首先，DIV指令必须实现精确的欧几里德除法，产生满足的商和余数$0 \le r < c$。 这确保了每个提取的数字位于基数的正确数字范围内$c$。 

其次，由重复除法引起的递推关系必须减少每一步工作值的大小。 由于每次迭代都会替换$u$经过$\lfloor u/c \rfloor$，我们有$$\left\lfloor \frac{u}{c^{j+1}} \right\rfloor < \left\lfloor \frac{u}{c^j} \right\rfloor$$每当该值非零时，保证在有限多个步骤后终止。 

数字重构身份$$u = \sum_{j \ge 0} U_j c^j$$直接通过展开重复商提取的递归，与标准基数相同$10$证明常数处处替换为$c$。 

## 注释

 常数$10$方法 1a 中除了定义基数之外不发挥任何结构作用。 因此，相同的程序模板可以实现到任何固定基数的转换$c$可用作除法指令中的机器常量。 唯一的限制是 MIX 除法必须遵循欧几里得除法语义，确保$0 \le r < c$，保证有效的数字提取。
