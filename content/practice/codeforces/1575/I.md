---
 标题：“CF 1575I - 沙漠的幻象”
 描述：“迷宫是一棵树。每个房间都有其价值$ai$，称为其错觉率。 穿过边缘$(x,y)$成本$$max( Queries either change the value of one room or ask for the minimum energy needed to travel between two rooms." date: "2026-06-10T10:56:33+07:00" tags: ["codeforces", "competitive-programming", "data-structures", "trees"] categories: ["algorithms"] codeforces_contest: 1575 codeforces_index: "I" codeforces_contest_name: "COMPFEST 13 - Finals Online Mirror (Unrated, ICPC Rules, Teams Preferred)" rating: 2300 weight: 1575 solve_time_s: 43 verified: false draft: false --- [CF 1575I - Illusions of the Desert](https://codeforces.com/problemset/problem/1575/I) **Rating:** 2300   **Tags:** data structures, trees   **Solve time:** 43s   **Verified:** no   ## Solution ## Problem Understanding The labyrinth is a tree. Every room has a value $a_i$, called its illusion rate. Moving through an edge $(x,y)$ costs$$\max(|a_x+a_y|,\|a_x-a_y|)。$$
Queries either change the value of one room or ask for the minimum energy needed to travel between two rooms.
Because the graph is a tree, there is exactly one path between any two rooms. A type 2 query is simply asking for the total edge cost along that unique path.
The first challenge is understanding the edge cost formula. For any two numbers $p$ and $q$,
$$\max(|p+q|,\|p-q|)=|p|+|q|。$$
One way to see this is to assume $|p|\ge |q|$. Then $p+q$ and $p-q$ have absolute values whose maximum is exactly $|p|+|q|$.
After this simplification, every edge $(x,y)$ has weight
$$|a_x|+|a_y|.$$
 这些值在更新期间会发生变化，因此边权重是动态的。 
限制很大：两者$n$和$q$可以达到$10^5$。 单个查询可能涉及包含以下内容的路径$O(n)$顶点。 为每个查询重新计算整个路径将导致粗略的结果$10^{10}$最坏情况下的操作，远远超出了3秒的限制。 我们需要每个查询接近对数时间的时间。 
一些容易被忽视的案例值得关注。 
考虑从节点到自身的查询：```
1
|
(only one node)
2 1 1
```没有遍历任何边，因此答案为 0。任何盲目求和路径权重的公式都必须正确处理此问题。
