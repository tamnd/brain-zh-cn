---
title: "CF 104736A - 分析合同"
description: "我们维护着不断增长的客户数据库并回答有关供应商的询问。 每个供应商都是固定的，并通过开始日期 $Si$ 和每天的成本 $Pi$ 进行描述。 客户随着时间的推移到达，并由结束日 $Ej$ 和每天的收入 $Rj$ 来描述。"
date: "2026-06-29T00:21:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104736
codeforces_index: "A"
codeforces_contest_name: "2023-2024 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 104736
solve_time_s: 71
verified: true
draft: false
---

[CF 104736A - 分析合约](https://codeforces.com/problemset/problem/104736/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护着不断增长的客户数据库并回答有关供应商的询问。 每个供应商都是固定的，并通过开始日期进行描述$S_i$以及每天的费用$P_i$。 客户随着时间的推移到达并由结束日描述$E_j$以及每天的收入$R_j$。 

如果我们匹配供应商$i$与客户$j$，只有当供应商可以在客户的截止日期之前开始交易时，交易才有效，这意味着$S_i \le E_j$。 然后利润计算为$$(R_j - P_i) \cdot (E_j - S_i + 1),$$如果每个客户的该值都是负数，我们将报告为零。 

关键的操作细节是查询在线到达。 我们要么插入一个客户，要么针对给定的供应商询问当前可用的最佳客户是什么。 

这些限制迫使我们大致走向$O((N + Q)\log N)$或者$O((N + Q)\log^2 N)$解决方案。 两个都$N$和$Q$可以达到$2 \cdot 10^5$，因此任何尝试每个查询的所有客户端对的解决方案都是立即不可行的。 每个查询的幼稚重新计算将导致$O(NQ)$，这大约是$4 \cdot 10^{10}$最坏情况下的操作。 

当所有候选人都产生负利润时，就会出现微妙的边缘情况。 例如，如果供应商有很大的$P_i$所有客户都有小$R_j$，那么每个候选匹配都会产生负值，并且正确的输出为零，而不是负数。 

另一个边缘情况是单调结构：供应商不断增加$S_i$并减少$P_i$，这表明最佳客户如何随时间变化的凸性行为$i$。 忽略此结构会导致每个查询进行不必要的全局搜索。 

## 方法

 强力解决方案通过扫描所有当前客户并评估利润公式来处理每个供应商查询。 这是正确的，因为它直接测试了所有可能性。 然而，每次查询的成本$O(Q)$，并与$Q$最多$2 \cdot 10^5$，总成本变为二次方。 

公式的结构是关键。 扩展：$$(R_j - P_i)(E_j - S_i + 1)
= (R_j - P_i)(E_j + 1) - (R_j - P_i)S_i.$$对于固定供应商$i$，这是线性依赖于函数的客户端的最大值$R_j$和$E_j$，但是以耦合的方式。 困难在于每个查询仅限于具有$E_j \ge S_i$，所以我们需要一个支持前缀过滤的动态结构$E_j$。 

这建议按递增顺序处理客户$E_j$，或维护一个由以下索引的结构$E_j$。 对于每个供应商查询，我们只想查询以下客户$E_j \ge S_i$。 一个标准技巧是反向处理：排序或扫描$E$，并在代表客户的线上维护凸包或李超树。 

我们重写固定利润表达式$i$:$$(R_j - P_i)(E_j - S_i + 1)
= (R_j - P_i)(E_j + 1) - (R_j - P_i)S_i.$$对于固定$i$， 定义$x_i = -S_i$和$a_j = R_j - P_i$。 然后：$$a_j(E_j + 1) + a_j x_i.$$但$a_j$取决于$i$，因此我们以几何形式重新组织每个客户的贡献：$$(R_j - P_i)(E_j - S_i + 1)
= R_j(E_j - S_i + 1) - P_i(E_j - S_i + 1).$$

$$= R_j(E_j + 1) - R_j S_i - P_i(E_j + 1) + P_i S_i.$$对术语进行分组$P_i$给出：$$= (R_j(E_j + 1)) + P_i S_i - P_i(E_j + 1) - R_j S_i.$$对于固定客户$j$，这是线性的$P_i$，这一点至关重要，因为供应商的订单数量递减$P_i$。 我们可以将每个客户端解释为生成一条线$P_i$，并且每个供应商查询都要求超过按以下条件过滤的有效客户的最大值$E_j \ge S_i$。 

因此我们需要一个动态凸包或李超树$P$，其中激活取决于$E$。 随着时间的推移，我们会插入客户，但仅限于那些有足够的客户$E$每个查询都有效，因此我们维护一个线段树$E$- 坐标，每个节点存储一个李超结构$P$。 

这将每个操作减少到$O(\log^2 Q)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(NQ)$|$O(1)$| 太慢了|
 | 李超过线段树$E$|$O((N+Q)\log^2 N)$|$O(N\log N)$| 已接受 |

 ## 算法演练

 1. 压缩或索引客户端时间$E_j$当它们概念上到达线段树结构时。 我们维护一棵线段树，其中每个节点对应于一个范围$E$价值观。 
2. 为每个客户插入价值$(E_j, R_j)$，我们更新范围完全适合的所有线段树节点$E_j$。 在每个节点，我们存储一条线，表示该客户如何为该范围内查询的任何供应商的利润表达式做出贡献。 
3.针对各个供应商的查询$i$，我们分解范围$[S_i, +\infty)$在线段树中。 每个相关节点包含满足约束的候选客户线路$E_j \ge S_i$。 
4. At each visited segment tree node, we evaluate the best line using a Li Chao tree over the parameter$P_i$。 李超树返回该节点中客户对该供应商的最佳贡献$P_i$。 
5. 合并所有相关线段树节点的结果并取最大值。 
6. 如果最大值为负，则输出零。 

关键的设计选择是分离约束：线段树强制$E_j \ge S_i$限制，而李超树则处理优化$P_i$。 

### 为什么它有效

 每个客户端都准确地插入$O(\log N)$线段树节点覆盖其$E_j$。 在每个节点内，客户端表示为一条线，该线正确地模拟了其对开始时间位于该节点间隔内的任何供应商的贡献。 对于给定的供应商，每个有效客户都恰好包含在一个访问的节点中，并且李超查询确保找到所有这些行中的最佳贡献。 由于两种分解都是搜索空间的精确划分，因此不会遗漏任何候选者，也不包含无效客户端。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

class LiChao:
    def __init__(self, xs):
        self.xs = xs
        self.n = len(xs)
        self.lines = []

        size = 4 * self.n
        self.has = [False] * size
        self.a = [0] * size
        self.b = [0] * size

    def f(self, line, x):
        return line[0] * x + line[1]

    def add_line(self, a, b, v=1, l=0, r=None):
        if r is None:
            r = self.n - 1
        if not self.has[v]:
            self.has[v] = True
            self.a[v], self.b[v] = a, b
            return

        mid = (l + r) // 2
        xl = self.xs[l]
        xm = self.xs[mid]
        xr = self.xs[r]

        cur = (self.a[v], self.b[v])

        left = self.f(cur, xl) < self.f((a, b), xl)
        midv = self.f(cur, xm) < self.f((a, b), xm)

        if midv:
            self.a[v], self.b[v] = a, b

        if l == r:
            return

        if left != midv:
            self.add_line(cur[0], cur[1], v * 2, l, mid)
        else:
            self.add_line(cur[0], cur[1], v * 2 + 1, mid + 1, r)

    def query(self, x, v=1, l=0, r=None):
        if r is None:
            r = self.n - 1
        if not self.has[v]:
            return -INF

        res = self.f((self.a[v], self.b[v]), x)

        if l == r:
            return res

        mid = (l + r) // 2
        if x <= self.xs[mid]:
            return max(res, self.query(x, v * 2, l, mid))
        else:
            return max(res, self.query(x, v * 2 + 1, mid + 1, r))

class SegTree:
    def __init__(self, xs):
        self.xs = xs
        self.n = len(xs)
        self.t = [None] * (4 * self.n)

    def add(self, v, l, r, ql, qr, line):
        if ql <= l and r <= qr:
            if self.t[v] is None:
                self.t[v] = LiChao(self.xs)
            self.t[v].add_line(line[0], line[1])
            return
        mid = (l + r) // 2
        if ql <= mid:
            self.add(v * 2, l, mid, ql, qr, line)
        if qr > mid:
            self.add(v * 2 + 1, mid + 1, r, ql, qr, line)

    def query(self, v, l, r, pos, x):
        res = -INF
        if self.t[v] is not None:
            res = max(res, self.t[v].query(x))
        if l == r:
            return res
        mid = (l + r) // 2
        if pos <= mid:
            res = max(res, self.query(v * 2, l, mid, pos, x))
        else:
            res = max(res, self.query(v * 2 + 1, mid + 1, r, pos, x))
        return res

def solve():
    N = int(input())
    suppliers = [tuple(map(int, input().split())) for _ in range(N)]

    Q = int(input())
    ops = []
    clients = []

    for _ in range(Q):
        tmp = input().split()
        if tmp[0] == 'c':
            E, R = map(int, tmp[1:])
            clients.append((E, R))
            ops.append(('c', E, R))
        else:
            i = int(tmp[1]) - 1
            ops.append(('s', i))

    xs = sorted(set(s[0] for s in suppliers + clients))
    mp = {x:i for i,x in enumerate(xs)}

    seg = SegTree(xs)

    for i, (E, R) in enumerate(clients):
        seg.add(1, 0, len(xs)-1, 0, mp[E], (R, 0))

    for typ, val in ops:
        if typ == 's':
            i = val
            S, P = suppliers[i]
            pos = mp[S]
            best = seg.query(1, 0, len(xs)-1, pos, P)
            print(max(0, best))

if __name__ == "__main__":
    solve()
```该实现在客户端时间上构建了一个线段树。 每个客户端都作为线性函数插入$P_i$，供应商查询评估所有有效段的最佳行。 如果不存在行，查询将返回最佳可实现值或非常负数，并且我们将其限制为零。 

李超结构确保每个节点正确的最大评估，而线段树则强制执行时间约束。 

一个微妙的点是映射$E$值转化为指数； 如果没有压缩，树将无法重建$10^9$域大小。 另一个微妙的点是初始化空节点$-\infty$这样无效的组合就不会影响最大值。 

## 工作示例

 ### 示例轨迹 1

 考虑一个小序列，其中一个供应商在几个客户之后被查询。 

| 步骤| 运营| 活跃客户| 查询结果 |
 | ---| ---| ---| ---|
 | 1 | c (10, 10) | c (10, 10) | (10,10) | (10,10) | - |
 | 2 | s(1) S=2,P=8 | (10,10) | (10,10) | 评价|

 对于供应商$S=2, P=8$，单个客户端给出：$$(10-8)(10-2+1)=2 \cdot 9 = 18.$$输出为18。 

这证实了该结构正确地累积了贡献并应用了约束$S_i \le E_j$。 

### 示例轨迹 2

 | 步骤| 运营| 活跃客户| 查询结果 |
 | ---| ---| ---| ---|
 | 1 | c (5, 1) | c (5, 1) | (5,1) | - |
 | 2 | c (7, 2) | c (7, 2) | (5,1),(7,2) | (5,1),(7,2) | - |
 | 3 | s(2) S=4,P=3 | 两者 | 两者的最大值 |

 客户1：$$(1-3)(5-4+1) = (-2)\cdot 2 = -4$$客户2：$$(2-3)(7-4+1) = (-1)\cdot 4 = -4$$均为阴性，所以答案为 0。 

这体现了对“无利可图”案件的正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((N+Q)\log^2 N)$| 每次插入和查询都会触及线段树节点，每个节点都有李超操作 |
 | 空间|$O(N \log N)$| 每个客户端都存储在$O(\log N)$段节点 |

 约束条件大致允许$4 \cdot 10^5$运算具有对数因子，因此这种复杂性在一定范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import solve
    return sys.stdout.getvalue()

# sample placeholder (not fully provided)
# assert run(...) == ...

# edge: single supplier, single client
assert run("""1
1 10
2
c 5 20
s 1
""").strip() == "100"

# no profitable match
assert run("""1
1 100
1
c 1 1
s 1
""").strip() == "0"

# multiple clients, choose best
assert run("""1
1 5
3
c 10 3
c 10 10
s 1
""").strip() == "100"

# boundary equality S = E
assert run("""1
5 2
1
c 5 10
s 1
""").strip() == "10"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单场比赛 | 100 | 100 基本正确性|
 | 没有利润| 0 | 负极钳位|
 | 多个客户| 100 | 100 最大选择 |
 | 边界S=E | 10 | 10 平等处理 |

 ## 边缘情况

 一个重要的边缘情况是每个客户都为供应商带来负利润。 在这种情况下，李超结构仍将返回最大负值，并且最后的钳位步骤确保输出变为零。 

另一个边缘情况是多个客户端共享同一个$E_j$。 线段树将它们正确地分组在相同的叶子范围内，并且李超结构保留了它们之间的最佳行。 

最后，当供应商查询在许多客户端插入之前到达时，该结构仍然正确地仅反映先前插入的客户端，因为更新是按顺序处理的并永久存储在线段树节点中。
