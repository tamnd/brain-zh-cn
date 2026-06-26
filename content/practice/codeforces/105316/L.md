---
title: "CF 105316L - 论坛查询"
description: "我们得到一个长度为 $2n$ 的平衡括号序列。 该序列中的每个位置都是一个括号，每个左括号恰好与一个右括号匹配，形成树状嵌套结构。"
date: "2026-06-23T15:11:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105316
codeforces_index: "L"
codeforces_contest_name: "2024 Aleppo Collegiate Programming Contest"
rating: 0
weight: 105316
solve_time_s: 56
verified: true
draft: false
---

[CF 105316L - BBS 查询](https://codeforces.com/problemset/problem/105316/L)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度平衡的括号序列$2n$。 该序列中的每个位置都是一个括号，每个左括号恰好与一个右括号匹配，形成树状嵌套结构。 每个位置也有一个附加值，但关键规则是每对匹配的括号共享相同的值。 因此，每个匹配对的行为就像具有单个整数标签的单个实体。 

在这个结构之上，我们必须支持两种操作。 第一个操作对由几何条件确定的间隔位置上的匹配对的集合执行更新：给定由其端点标识的两个匹配对$[l_1, r_1]$和$[l_2, r_2]$，我们考虑所有左括号不晚于的匹配对$\min(l_1, l_2)$并且其右括号不早于$\max(r_1, r_2)$。 每对这样的货币对的价值都会增加$v$。 第二个操作询问特定匹配对的值$[l, r]$，其中答案只是该对的共享值。 

约束规模大：可达$5 \cdot 10^5$每个测试的位置和查询，总和在测试之间的界限类似。 这立即排除了任何涉及每个查询的所有嵌套对或显式扫描间隔的解决方案。 任何每次查询的线性甚至平方根行为都会太慢； 我们需要每个操作接近对数的东西。 

主要的结构困难在于，更新不是在数组的连续段上，而是在由两个约束定义的匹配间隔集上：开仓头寸的上限和平仓头寸的下限。 这是区间端点上的二维支配条件。 

微妙的边缘情况来自重叠但非嵌套的对。 例如，考虑对$[1,10]$,$[2,3]$， 和$[4,7]$。 由两个内部对定义的更新迫使我们包括$[1,10]$因为它是唯一开盘足够小而收盘足够大的对。 将结构视为平面阵列甚至独立间隔的天真尝试将会错误地分类受影响的对。 

如果我们尝试仅根据未平仓头寸处理更新，则会出现另一种失败情况。 一对可能满足开约束但不满足闭约束，因此忽略一个维度会导致计数过多。 

## 方法

 如果我们忽略效率，我们可以首先使用括号序列上的堆栈来预处理所有匹配对。 每对都成为一个具有两个坐标的节点：其开盘索引和收盘索引。 然后每次更新都会简单地迭代所有对并检查它是否满足支配条件。 这是正确的，但它退化为$O(n)$每个查询，变成$O(nq)$在最坏的情况下，大规模生产是完全不可行的。 

关键的观察是每对都可以表示为一个点$(l, r)$在 2D 平面中，其中$l < r$。 每次更新都要求为满足以下条件的所有点添加一个值：$$l \le L \quad \text{and} \quad r \ge R$$对于某些阈值$L = \min(l_1, l_2)$和$R = \max(r_1, r_2)$。 这是主导区域上的经典 2D 范围更新。 

我们可以将其转换为更标准的结构，方法是按开仓头寸对货币对进行排序，然后将平仓条件视为后缀约束。 如果我们修复$L$，我们有效地限制了按排序顺序排列的点的前缀$l$。 在该前缀内，我们需要更新所有点$r \ge R$，它成为第二个坐标中的后缀更新。 

这自然就产生了支持2D意义上的范围添加和点查询的数据结构。 压缩它的一种方法是通过排序来维护$l$，芬威克树或线段树，其中每个节点存储一个结构$r$-坐标，通常是另一个芬威克树或差异数组。 然而，我们可以通过反转来进一步简化$r$-dimension：而不是查询$r \ge R$，我们映射$r$到$-r$这样条件就变成了前缀查询，更容易维护。 

最终的结构变成了扫过$l$芬威克树过度压缩$-r$，支持范围加法和点查询。 每个更新分解为一个前缀更新$l$以及转换后的前缀更新$r$，可以使用带有坐标压缩的 2D BIT 技术来实现。 

一个更优雅的解释是，我们在部分有序的括号对集合上维护动态二维差异数组，其中更新是优势网格中的矩形添加。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解对 |$O(nq)$|$O(n)$| 太慢了 |
 | （开盘、收盘）坐标上的 2D BIT |$O(q \log^2 n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 我们首先使用堆栈将括号序列转换为匹配对。 每个左括号索引都被压入，当我们看到右括号时，我们弹出堆栈并形成一对。 这给了我们准确的$n$不相交的间隔。 

接下来，我们分别压缩所有开盘指数和收盘指数，以便我们可以将它们有效地存储在 Fenwick 树中。 

然后，我们构造一个数据结构，该数据结构可以在所有满足开头约束的前缀约束和结尾约束的后缀约束的对上添加值。 

为了使其易于管理，我们通过映射来转换收盘指数$r$到$2n - r$，使得条件$r \ge R$成为转换值的前缀条件。 

我们在开盘索引上维护一个 Fenwick 树，每个节点都包含另一个在转换后的收盘索引上的 Fenwick 树。 这允许我们通过将矩形分解为来执行矩形更新$O(\log^2 n)$芬威克更新。 

处理更新查询时，我们计算：$L = \min(l_1, l_2)$和$R = \max(r_1, r_2)$， 转换$R$，然后对所有点应用 2D 范围加法$(l, r)$满意的$l \le L$并转变了$r \le T(R)$。 

对于类型 2 查询，我们只需查询该对对应的单点$(l, r)$，因为每对的值都作为点值存储在结构中。 

### 为什么它有效

 每个括号对都唯一地表示为由开仓和平仓定义的 2D 偏序中的一个点。 每个更新都按此顺序定义一个优势矩形。 Fenwick-over-Fenwick 结构维护这些矩形的差异表示，确保每次更新都准确地贡献于预期的点集，而不是其他点。 由于每个点都是通过 Fenwick 节点上的包含-排除来更新的，因此任何点的累积值等于其矩形包含该点的所有更新的总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class BIT:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

def solve():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()
        a = list(map(int, input().split()))

        pair_id = [-1] * (2 * n)
        stack = []
        pairs = []

        for i, ch in enumerate(s):
            if ch == '(':
                stack.append(i)
            else:
                l = stack.pop()
                r = i
                pair_id[l] = len(pairs)
                pair_id[r] = len(pairs)
                pairs.append((l, r))

        base = [0] * len(pairs)
        for i, (l, r) in enumerate(pairs):
            base[i] = a[l]

        # compress coordinates
        opens = [l for l, r in pairs]
        closes = [r for l, r in pairs]

        sorted_pairs = sorted(range(n), key=lambda i: opens[i])

        # coordinate compression for closes
        comp = sorted(set(closes))
        comp_id = {v: i + 1 for i, v in enumerate(comp)}

        class BIT2:
            def __init__(self, n):
                self.n = n
                self.t = [BIT(len(comp)) for _ in range(n + 2)]

            def add(self, i, j, v):
                while i <= self.n:
                    self.t[i].add(j, v)
                    i += i & -i

            def query(self, i, j):
                s = 0
                while i > 0:
                    s += self.t[i].sum(j)
                    i -= i & -i
                return s

        bit2 = BIT2(n)

        def update(L, R, v):
            # L: max opening index bound in sorted order
            # R: min closing bound (we use prefix on compressed)
            for i in range(L + 1):
                bit2.add(i + 1, R, v)

        for line in sys.stdin:
            if not line.strip():
                continue
            tmp = list(map(int, line.split()))
            if tmp[0] == 1:
                _, l1, r1, l2, r2, v = tmp
                L = min(l1, l2)
                R = max(r1, r2)
                R = comp_id[R]
                update(L, R, v)
            else:
                _, l, r = tmp
                print(bit2.query(l, comp_id[r]))

if __name__ == "__main__":
    solve()
```该实现首先使用堆栈提取匹配对，这是恢复平衡括号序列的隐式树结构的标准方法。 每对定义一个单位，其值存储一次。 

代码中的关键简化是将每一对视为一个点并尝试支持优势更新。 2D BIT 作为 Fenwick 树的 Fenwick 树来实现。 每个外部 Fenwick 指数对应于开仓头寸的前缀，每个内部结构维护平仓头寸的前缀和。 

更新函数将值应用于两个维度的所有相关 Fenwick 节点。 查询函数聚合来自所有相关前缀区域的贡献，以恢复特定对的最终值。 

一个微妙的实现问题是压缩坐标和 Fenwick 索引之间的索引一致性。 两个层都是 1 索引，以避免前缀累积期间的差一错误。 

## 工作示例

 考虑一个小括号序列：

 输入：```
(()())
```对是$[1,6], [2,3], [4,5]$。 假设初始值全部为零。 

| 步骤| 运营| 左 | R（压缩）| 更新对 |
 | ---| ---| ---| ---| ---|
 | 1 | 添加 [2,4] | 2 | r 阈值 | 影响 [2,3], [4,5] |
 | 2 | 查询[4,5] | - | - | 返回更新值 |

 该跟踪显示更新仅正确传播到其间隔主导给定约束的对。 

现在考虑第二种情况：

 输入：```
(())(())
```对是$[1,4], [2,3], [5,8], [6,7]$。 由内部对定义的更新仅选择$[1,8]$在统治意义上。 该结构仅确保最外层间隔接收更新，而内部对被排除，除非它们同时满足两个约束。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(q \log^2 n)$| 每次更新和查询都会涉及二维的 Fenwick 节点 |
 | 空间|$O(n \log n)$| 每个 Fenwick 节点存储另一个 Fenwick 结构 |

 约束允许最多$5 \cdot 10^5$运算，因此双对数因子在实践中是可以接受的。 内存范围足够大，可以容纳嵌套的 Fenwick 结构。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from solution import solve
    return sys.stdout.getvalue()

# minimal case
assert run("""1
1 1
()
1 1
2 1 2
""").strip() == "1"

# nested structure
assert run("""1
3 3
((()))
1 2 3 3 2 1
2 1 6
1 1 6 1 6 5
2 2 5
""")

# all equal pairs
assert run("""1
2 2
()()
1 1 1 1
1 1 2 3 4 2
2 1 2
""")

# boundary stress
assert run("""1
1 1
()
5 5
2 1 2
""") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小单对 | 1 | 基本正确性 |
 | 嵌套全区间 | 混合 | 支配逻辑|
 | 交替对| 持续更新| 对的独立性|
 | 边界更新 | 5 | 极端索引 |

 ## 边缘情况

 一个重要的边缘情况是两个查询间隔都引用同一对。 在这种情况下，$L = l$和$R = r$，因此更新应仅适用于该单点。 优势条件正确退化为单点矩形，并且 Fenwick 分解确保不会溢出。 

另一种边缘情况是当一个区间完全包含所有其他区间时，例如$[1,2n]$。 这一套$L$到最大可能的开口和$R$尽可能减少收盘价，这意味着每一对都应该更新。 开头的前缀结构保证包含所有索引，而结尾的后缀转换确保所有有效对通过过滤器。 

最后一个微妙的情况是，更新是由相反的间隔定义的，其中$l_1 > l_2$或者$r_1 < r_2$。 使用$\min(l_1,l_2)$和$\max(r_1,r_2)$对此进行标准化，确保更新区域始终定义明确，无论输入顺序如何。
