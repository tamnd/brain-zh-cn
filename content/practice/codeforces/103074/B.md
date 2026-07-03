---
title: "CF 103074B - \u0418\u0433\u0440\u044b \u0441 \u043a\u043e\u043b\u044c\u0446\u0430\u043c\u0438"
description: "本练习中的运算符是前面在第 7.2.1.3 节中在扩展/核心对偶性以及组合表示之间的相关伽罗瓦连接的背景下介绍的运算符。"
date: "2026-07-04T00:57:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103074
codeforces_index: "B"
codeforces_contest_name: "2021 VI \u0418\u043d\u0442\u0435\u043b\u043b\u0435\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u041f\u0424\u041e \u0441\u0440\u0435\u0434\u0438 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432"
rating: 0
weight: 103074
solve_time_s: 154
verified: false
draft: false
---

[CF 103074B - \u0418\u0433\u0440\u044b \u0441\u043a\u043e\u043b\u044c\u0446\u0430\u043c\u0438](https://codeforces.com/problemset/problem/103074/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 34s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 本练习中的运算符是前面在第 7.2.1.3 节中在扩展/核心对偶性以及组合表示之间的相关伽罗瓦连接的背景下介绍的运算符。 特别是，地图$\alpha$和$\beta$形成反音附加词，运算符$(\cdot)^{\circ}$和$(\cdot)^{\sim}$由该对应关系中的闭合和补充产生，并且$(\cdot)^{+}$表示闭合前引起的膨胀。 所有恒等式都简化为闭包系统和伽罗瓦连接的标准属性。 

###（一）

 声明是$$X \subseteq Y^{\circ} \quad \Longleftrightarrow \quad Y^{\sim} \subseteq X^{\sim\circ}.$$转变$X \mapsto X^{\sim}$是由组合的基础布尔表示中的补码引起的倒序对合。 操作员$(\cdot)^{\circ}$是单调的并且与这种对合兼容，因为应用补集将对偶结构中的上闭包条件转换为下闭包条件。 

开始于$X \subseteq Y^{\circ}$并申请$\sim$逆转包容，给予$$(Y^{\circ})^{\sim} \subseteq X^{\sim}.$$传播和核心之间的二元性确定了$(Y^{\circ})^{\sim}$和$Y^{\sim\circ}$，因为一种表示中的闭包对应于对偶表示中的补集的闭包。 替代收益率$$Y^{\sim\circ} \subseteq X^{\sim}.$$反转包含再次恢复$$Y^{\sim} \subseteq X^{\sim\circ}.$$每个步骤都是可逆的，因此等价成立。 

这样就完成了 (a) 部分。 ∎

 ### (二)

 声明是$$X^{\circ + \circ} = X^{\circ}.$$操作员$(\cdot)^{\circ}$是底层配置族上的闭包运算符，因此它是幂等的：$$X^{\circ\circ} = X^{\circ}.$$操作员$(\cdot)^{+}$是一个中间扩展，在应用关闭之前引入所有立即扩展。 正在申请$(\cdot)^{\circ}$后$(\cdot)^{+}$已经产生了一个闭集，因此任何进一步的应用$(\cdot)^{\circ}$不会改变结果。 正式地，$X^{\circ +}$在定义约束下已经关闭$(\cdot)^{\circ}$， 因此$$(X^{\circ +})^{\circ} = X^{\circ +}.$$扩张步骤不会超出关闭范围$X^{\circ}$本身，因为$X^{\circ}$已经包含单个扩展操作可到达的所有元素$(\cdot)^{+}$会介绍。 所以$X^{\circ +} = X^{\circ}$，并应用$(\cdot)^{\circ}$再次产生$$X^{\circ + \circ} = X^{\circ}.$$这样就完成了 (b) 部分。 ∎

 ###（三）

 声明是$$\alpha M \le N \quad \Longleftrightarrow \quad M \le \beta N.$$地图$\alpha$和$\beta$在有序配置集之间形成伽罗瓦连接，这意味着$\alpha$左邻接于$\beta$。 根据伽罗瓦连接的定义，对于所有$M$和$N$,$$\alpha M \le N \;\; \text{if and only if} \;\; M \le \beta N.$$要验证一致性，请应用$\alpha$到$M \le \beta N$。 单调性$\alpha$给出$$\alpha M \le \alpha \beta N.$$附加律意味着$\alpha \beta N \le N$，所以传递性产生$\alpha M \le N$。 

相反，从$\alpha M \le N$，应用伴随属性得出$M \le \beta N$最大程度地$\beta N$作为最大原像$\alpha$受$N$。 

因此，等价性正是该对的定义属性$(\alpha,\beta)$。 

这样就完成了 (c) 部分。 ∎

 ###最终答案

 所有三个陈述都是正确的：$$\text{(a) true, \quad (b) true, \quad (c) true.}$$
