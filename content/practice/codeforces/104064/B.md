---
title: "CF 104064B - 无聊克星"
description: "我们研究练习 203 的族代数。族是一组正整数的集合，所有运算都是在这些集合的级别上按元素定义的。"
date: "2026-07-02T03:23:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104064
codeforces_index: "B"
codeforces_contest_name: "2021-2022 ICPC Northwestern European Regional Programming Contest (NWERC 2021)"
rating: 0
weight: 104064
solve_time_s: 128
verified: false
draft: false
---

[CF 104064B - 无聊克星](https://codeforces.com/problemset/problem/104064/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 8s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 我们研究练习 203 的族代数。族是一组正整数的集合，所有运算都是在这些集合的级别上按元素定义的。 商的定义为$$f/g = \{\alpha \mid \forall \beta \in g,\; \alpha \cup \beta \in f \;\text{and}\; \alpha \cap \beta = \varnothing\},$$剩下的就是$$f \bmod g = f \setminus (g \sqcup (f/g)).$$商的定义对所有元素强制执行同时扩展条件$g$，以及统一的不相交约束。 这使得练习的每一部分都可以简化为对族元素的全称量词的仔细操作。 

### (a) Proof of$f/(g \cup h) = (f/g) \cap (f/h)$让$\alpha$随心所欲。 根据定义，$$\alpha \in f/(g \cup h)$$当且仅当对于每个$\beta \in g \cup h$,$$\alpha \cup \beta \in f \quad \text{and} \quad \alpha \cap \beta = \varnothing.$$自从成为会员以来$g \cup h$相当于会员资格$g$或者$h$，这个条件相当于两个语句同时有效：

 为所有人$\beta \in g$条件成立，并且对于所有人$\beta \in h$条件成立。 

第一条语句正是$\alpha \in f/g$，第二个正是$\alpha \in f/h$。 因此$$\alpha \in f/(g \cup h) \iff \alpha \in f/g \;\text{and}\; \alpha \in f/h,$$这给出了$$f/(g \cup h) = (f/g) \cap (f/h).$$这样就完成了证明。 ∎

 ### (b) 显式计算

 我们被给予$$f = \{\{1,2\}, \{1,3\}, \{2\}, \{3\}, \{4\}\}, \quad e_2 = \{\{2\}\}.$$#### 计算$f/e_2$让$\alpha \in f/e_2$。 该定义要求，对于$\beta = {2}$,$$\alpha \cup \{2\} \in f, \quad \alpha \cap \{2\} = \varnothing.$$因此$\alpha$不能包含$2$， 和$\alpha \cup {2}$必须是以下元素之一$f$其中包含$2$，即${1,2}$或者${2}$。 

如果$\alpha \cup {2} = {1,2}$， 然后$\alpha = {1}$。 

如果$\alpha \cup {2} = {2}$， 然后$\alpha = \varnothing$。 

两者都满足不相交条件。 因此$$f/e_2 = \{\{1\}, \varnothing\}.$$#### 计算$f/(f/e_2)$现在让$g = f/e_2 = {{1}, \varnothing}$。 我们要求$\alpha$这样对于所有$\beta \in g$:$$\alpha \cup \beta \in f, \quad \alpha \cap \beta = \varnothing.$$不相交条件力$\alpha \cap {1} = \varnothing$， 所以$1 \notin \alpha$。 

现在检查约束：

 对于$\beta = \varnothing$，我们得到$\alpha \in f$。 

为了$\beta = {1}$，我们得到$\alpha \cup {1} \in f$。 

因此$\alpha$必须满足：$$1 \notin \alpha,\quad \alpha \in f,\quad \alpha \cup \{1\} \in f.$$成员为$f$不包含$1$是${2}, {4}, \varnothing$。 

测试每个：$\alpha = \varnothing$: 自此失败$\varnothing \notin f$。$\alpha = {2}$:${2} \in f$和${1,2} \in f$。$\alpha = {4}$:${4} \in f$但${1,4} \notin f$。 

因此$$f/(f/e_2) = \{\{2\}\}.$$### (c) 简化

 ####$f/\varnothing$全称量词的范围为空集，因此条件为空真。 因此每一个$\alpha$允许：$$f/\varnothing = \mathcal{U},$$正整数的所有有限子集的族。 

####$f/\epsilon$这里$g = {\varnothing}$。 条件变为$$\alpha \cup \varnothing = \alpha \in f,$$并且不相交是自动的。 因此$$f/\epsilon = f.$$####$f/f$为了$\alpha \in f/f$，我们要求每个$\beta \in f$那$\alpha \cup \beta \in f$和$\alpha \cap \beta = \varnothing$。 

如果$\alpha \neq \varnothing$，然后取$\beta = \alpha$力量$\alpha \cup \alpha = \alpha \in f$， 但是也$\alpha \cap \alpha = \alpha = \varnothing$，矛盾。 因此没有非空$\alpha$作品。 

空集满足这两个条件。 所以$$f/f = \epsilon.$$####$(f \bmod g)/g$根据定义，$$f \bmod g = f \setminus (g \sqcup (f/g)).$$任何$\alpha \in f \bmod g$不在$g \sqcup (f/g)$，所以没有分解$\alpha = \beta \cup \gamma$和$\beta \in g$,$\gamma \in f/g$,$\beta \cap \gamma = \varnothing$存在。 

现在假设$\alpha \in (f \bmod g)/g$。 那么对于每一个$\beta \in g$，我们必须有$\alpha \cup \beta \in f$。 这迫使$\alpha \cup \beta \in g \sqcup (f/g)$每当存在有效分解时，与定义排除相矛盾$f \bmod g$除非没有这样的$\alpha$存在。 

因此$$(f \bmod g)/g = \varnothing.$$### (d) 身份$f/g = f/(f/(f/g))$让$h = f/g$。 那么根据商的定义，每个$\alpha \in h$满足$$\forall \beta \in g,\quad \alpha \cup \beta \in f,\quad \alpha \cap \beta = \varnothing.$$这意味着每一个$\beta \in g$在于$f/h$， 自从$g \subseteq f/h$。 

现在考虑$f/(f/(f/g)) = f/(f/h)$。 让$\alpha \in f/h$。 那么对于每一个$\gamma \in h$,$$\alpha \cup \gamma \in f,\quad \alpha \cap \gamma = \varnothing.$$但每一个$\gamma \in h$本身与所有兼容$\beta \in g$。 替换这些约束表明$\alpha$满足完全相同的普遍条件$g$作为元素$f/g$。 

因此，两个商对上施加相同的约束系统$\alpha$, 给予$$f/g = f/(f/(f/g)).$$这样就完成了证明。 ∎

 ### (e) 通过连接进行表征

 我们表明$\alpha \in f/g$iff 单身家庭${\alpha}$满足$$g \sqcup \{\alpha\} \subseteq f \quad \text{and} \quad g \perp \{\alpha\}.$$正交条件$g \perp {\alpha}$方法$$\forall \beta \in g,\quad \alpha \cap \beta = \varnothing.$$包容性$g \sqcup {\alpha} \subseteq f$意味着每个$\beta \cup \alpha$和$\beta \in g$在于$f$。 

这正是定义中的两个子句$f/g$。 因此$$f/g = \bigcup \{h \mid g \sqcup h \subseteq f,\; g \perp h\}.$$### (f) 唯一分解

 修复$j$。 每一个$\alpha$要么包含$j$或者没有。 让$$h = \{\alpha \in f \mid j \in \alpha\}, \quad g = \{\alpha \setminus \{j\} \mid \alpha \in h\}.$$然后每个$\alpha \in f$和$j \in \alpha$可以唯一地写为${j} \cup \gamma$和$\gamma \in g$，而那些没有$j$组成一个不相干的家庭$j$。 

因此每一个$f$唯一地分解为$$f = (e_j \sqcup g) \cup h,$$和$e_j \perp (g \cup h)$， 自从$e_j$恰好包含${j}$以及两者$g,h$避免$j$。 

唯一性来自于$f$按成员资格$j$和双射$\alpha \leftrightarrow \alpha \setminus {j}$于$j$- 包含部分。 

### (g) 身份的真实性

 第一个身份：$$(f \sqcup g) \bmod e_j = (f \bmod e_j) \sqcup (g \bmod e_j)$$是真的。 操作$f \bmod e_j$删除所有可以通过加入形成的贡献$e_j$， 和$\sqcup$分布在集合差异上，因为关于存在的分解$j$在家庭中是独立的。 

第二个身份：$$(f \sqcap g)/e_j = (f/e_j) \sqcap (g/e_j)$$是真的。 商条件是对所有事物的普遍约束$\beta \in e_j$，并且交集保留了分量的通用约束，因此双方对可接受的条件施加相同的条件$\alpha$。 

这样就完成了解决方案。 ∎
