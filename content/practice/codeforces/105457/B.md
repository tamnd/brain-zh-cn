---
title: "CF 105457B - 岛屿和山脉"
description: "我们得到一条土地，分为 $n$ 个连续的部分，每个部分都有固定的高度。 随着时间的推移，海平面逐步上升，每次上升后我们必须确定还剩下多少个相连的旱地群。"
date: "2026-06-23T17:46:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105457
codeforces_index: "B"
codeforces_contest_name: "XXIII Spain Olympiad in Informatics, Online Qualifier 1"
rating: 0
weight: 105457
solve_time_s: 78
verified: true
draft: false
---

[CF 105457B - 岛屿和山脉](https://codeforces.com/problemset/problem/105457/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一条土地线，分为$n$连续的段，每个段都有固定的高度。 随着时间的推移，海平面逐步上升，每次上升后我们必须确定还剩下多少个相连的旱地群。 

如果某个路段的高度严格高于当前海平面阈值条件，则该路段被视为干燥$a_i > m$，否则会被淹没。 原始线中相邻的干段形成一个岛，因此岛只是高度高于当前海平面的最大连续索引块。 

每年之后，随着海平面的上升，一些部分会被永久淹没，这只能将现有岛屿分解成更小的岛屿或完全消除它们。 

输入由多个独立的案例组成。 每种情况都给出一个高度数组和严格递增的海平面序列。 对于每个海平面，我们必须输出连接的干分量的数量。 

约束使结构清晰：$n$和$k$可以达到$10^5$，因此在每次查询后从头开始重新计算岛屿会太慢。 任何每次查询重复扫描数组的解决方案都会花费成本$O(nk)$，达到$10^{10}$在最坏的情况下操作是不可行的。 

朴素方法的一个微妙的失败案例是在不记住先前状态的情况下重新计算。 例如，考虑高度$[5, 1, 5]$和海平面$1$然后$5$。 处于水平$1$，我们有两个岛：位置 0 和 2 是干燥的。 处于水平$5$，一切都被淹没了，所以答案是$0$。 每个查询的简单扫描在这里仍然有效，但是许多不正确的优化尝试“本地更新计数”，而不跟踪中间泛洪在反向推理中正确合并分离事件，这在多个点同时泛洪时破坏了一致性。 

另一个重要的边缘情况是等高。 由于洪水发生时$a_i \le m_i$，线段恰好在其高度阈值处消失，并且未能正确对待平等会导致岛屿计数相差一个。 

## 方法

 直接方法通过扫描整个阵列并计算干燥段开始的次数，在每次海平面上升后重新计算岛屿数量。 这是有效的，因为每个岛都是连续的干电池，所以我们可以随时检测到一个新岛$a_i > m$以及$i = 0$或者$a_{i-1} \le m$。 正确性很简单，但是对每个查询执行此操作都会重复相同的完整遍历$k$次。 

瓶颈很明显：每次查询的成本$O(n)$，因此总复杂度变为$O(nk)$。 两者都达到$10^5$，这远远超出了任何实际限制。 

关键的观察结果是洪水是单调的。 一旦某个部分被淹没，它就永远不会返回。 我们没有模拟前进的过程，而是颠倒了视角：想象所有土地最初都被淹没，我们按照海平面降序“解除淹没”部分，或者等效地通过增加高度来处理部分。 

当我们按高度对分段进行排序时，每次“激活”一个分段（意味着当海平面经过其下方时，它会变得干燥），它要么形成一个新岛屿，要么合并两个现有岛屿（如果两个邻居都已处于活动状态）。 这是线路上的经典动态连接过程，可以使用不相交集结构来维护。 

为了将其与查询联系起来，我们按高度递增的顺序处理激活，同时按海平面递增的顺序处理查询。 对于每个查询阈值，我们激活高度大于该阈值的所有段，从而维护连接的组件。 

每次激活都会使岛屿计数增加 1 或减少，具体取决于邻居是否处于活动状态。 一行上的并查找可确保每次合并$O(\alpha(n))$，给出几乎线性的解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(nk)$|$O(1)$| 太慢了 |
 | 排序+DSU扫 |$O((n+k)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将问题转化为反向激活过程，其中土地逐渐从最高到最低出现。 

1. 将每个段索引与其高度配对，并按高度降序对这些对进行排序。 这让我们可以从最高到最短激活土地，确保当一个部分变得活跃时，所有更高的部分都已经处于活动状态。 这种排序至关重要，因为岛屿结构仅取决于邻居是否活跃，而不取决于绝对高度。 
2. 按海平面降序对查询进行排序，同时保留原始索引。 每个查询代表一个阈值； 在回答之前，我们将激活严格高于该阈值的所有分段。 
3. 维护一个布尔数组`active[i]`指示是否分段$i$目前处于干燥状态。 还维护索引上的不相交集并集结构，以跟踪活动段之间的连接组件。 
4.保留一个柜台`islands`初始化为零。 每当一个新的细分变得活跃时，我们就暂时将其视为一个新岛屿。 
5. 激活位置时$i$，检查其左邻居$i-1$和右邻居$i+1$。 如果邻居处于活动状态，我们将这些集合合并。 每次两个先前独立的组件合并时，我们都会将岛屿数量减少一个。 这可确保计数始终与连接的有源组件的数量相匹配。 
6. 按降序处理查询。 对于每个查询值$m$，激活所有高度大于的线段$m$。 处理完所有此类激活后，存储当前的`islands`作为该查询的答案。 
7. 将答案恢复到原始查询顺序。 

核心不变量是，在任何时刻，DSU 组件都与活动索引的连续块完全对应。 每个组件代表一个岛屿，因为邻接是唯一允许的连接。 当我们激活一个新单元时，它要么创建一个新的孤立组件，要么与最多两个邻居合并，从而正确更新岛计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True

def solve_case(n, k, a, m):
    segs = sorted([(a[i], i) for i in range(n)], reverse=True)
    queries = sorted([(m[i], i) for i in range(k)], reverse=True)

    dsu = DSU(n)
    active = [False] * n

    ans = [0] * k
    ptr = 0
    islands = 0

    for qval, qi in queries:
        while ptr < n and segs[ptr][0] > qval:
            h, i = segs[ptr]
            active[i] = True
            islands += 1

            if i > 0 and active[i - 1]:
                if dsu.union(i, i - 1):
                    islands -= 1
            if i + 1 < n and active[i + 1]:
                if dsu.union(i, i + 1):
                    islands -= 1

            ptr += 1

        ans[qi] = islands

    return ans

def main():
    data = sys.stdin.read().strip().split()
    idx = 0
    out = []

    while idx < len(data):
        n = int(data[idx]); k = int(data[idx + 1])
        idx += 2
        a = list(map(int, data[idx:idx + n]))
        idx += n
        m = list(map(int, data[idx:idx + k]))
        idx += k

        res = solve_case(n, k, a, m)
        out.append(" ".join(map(str, res)))

    print("\n".join(out))

if __name__ == "__main__":
    main()
```DSU 跟踪当前活动段之间的连接性。 这`active`array 确保我们只合并已经未被淹没的土地。 每个联合对应于两个岛屿的合并，因此递减计数器可以保持正确性。 

一个微妙的实现细节是严格的比较`a[i] > m`。 这就是激活使用的原因`> qval`。 如果我们错误地使用了`>=`，恰好位于水位的部分将被错误地处理，并且将保持活动状态太长时间，从而导致岛屿数量膨胀。 

指针`ptr`确保每个段在所有查询中激活一次，从而使排序后扫描呈线性。 

## 工作示例

 ### 示例 1

 输入：```
n = 7, k = 1
a = [9, 1, 6, 1, 3, 7, 2]
m = [5]
```按高度排序的段：

 | 步骤| 高度| 索引 | 活动集| 岛屿 |
 | ---| ---| ---| ---| ---|
 | 1 | 9 | 0 | {0} | 1 |
 | 2 | 7 | 5 | {0,5} | 2 |
 | 3 | 6 | 2 | {0,2,5} | 3 |
 | 4 | 3 | 4 | {0,2,4,5} | 3（如果没有相邻则合并）|
 | 5 | 2 | 6 | {0,2,4,5,6} | 3 |
 | 6 | 1 | 1 | {0,1,2,4,5,6} | 2 |
 | 7 | 1 | 3 | 全部 | 1 |

 对于阈值 5，仅激活严格大于 5 的值：9、7、6。这些形成组件 {0}、{5}、{2}，从而形成 3 个岛。 

该跟踪显示岛与激活集中的连接组件完全对应。 

### 示例 2

 输入：```
n = 5, k = 3
a = [2, 2, 2, 2, 2]
m = [1, 2, 3]
```| 查询 | 激活指数| 岛屿 |
 | ---| ---| ---|
 | 3 | 无 | 0 |
 | 2 | 无（严格 > 2）| 0 |
 | 1 | 全部 | 1 |

 这个案例清楚地表明了严格的不平等行为。 在第 2 级，一切都被淹没，因此不存在岛屿。 只有当阈值低于 2 时才会出现陆地。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n + k)\log n)$| 排序段和查询占主导地位； DSU 操作几乎保持不变 |
 | 空间|$O(n)$| DSU 阵列和激活状态 |

 该解决方案在限制范围内非常适合，因为每个元素都排序一次，并且联合查找操作按逆阿克曼时间分摊，即使在实践中也有效恒定$10^5$元素。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from collections import deque

    # assume solution is defined above in same runtime
    return main_capture(inp)

def main_capture(inp: str) -> str:
    import sys
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().strip().split()
    idx = 0
    out = []

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1] * n

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            ra, rb = self.find(a), self.find(b)
            if ra == rb:
                return False
            if self.size[ra] < self.size[rb]:
                ra, rb = rb, ra
            self.parent[rb] = ra
            self.size[ra] += self.size[rb]
            return True

    def solve_case(n, k, a, m):
        segs = sorted([(a[i], i) for i in range(n)], reverse=True)
        queries = sorted([(m[i], i) for i in range(k)], reverse=True)

        dsu = DSU(n)
        active = [False] * n
        ans = [0] * k
        ptr = 0
        islands = 0

        for qval, qi in queries:
            while ptr < n and segs[ptr][0] > qval:
                h, i = segs[ptr]
                active[i] = True
                islands += 1

                if i > 0 and active[i - 1]:
                    if dsu.union(i, i - 1):
                        islands -= 1
                if i + 1 < n and active[i + 1]:
                    if dsu.union(i, i + 1):
                        islands -= 1

                ptr += 1

            ans[qi] = islands

        return ans

    while idx < len(data):
        n = int(data[idx]); k = int(data[idx + 1])
        idx += 2
        a = list(map(int, data[idx:idx + n]))
        idx += n
        m = list(map(int, data[idx:idx + k]))
        idx += k
        out.append(" ".join(map(str, solve_case(n, k, a, m))))

    return "\n".join(out)

# provided samples
assert run("""7 1
9 1 6 1 3 7 2
5
""") == "3", "sample 1"

assert run("""10 5
9 5 4 10 3 2 5 6 2 6
3 4 6 8 9
""") == "3 4 2 2 1", "sample 2"

# custom cases
assert run("""1 1
5
4
""") == "1", "single element"

assert run("""5 1
1 2 3 4 5
5
""") == "0", "all submerged"

assert run("""5 1
1 2 3 4 5
0
""") == "1", "all active"

assert run("""6 1
5 1 5 1 5 1
3
""") == "3", "alternating heights"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 1 | 最小结构|
 | 全部淹没| 0 | 严格的行为门槛|
 | 全部活跃 | 1 | 全连接合并|
 | 交替高度| 3 | 多岛形成|

 ## 边缘情况

 一个关键的边缘情况是当多个相邻段在同一查询窗口中激活并立即合并时。 考虑输入`a = [3, 2, 1]`具有查询阈值`0`。 所有段均按顺序激活，但岛计数必须以 1 结束，而不是 3。该算法通过在激活时递增岛，然后立即与邻居合并，针对每个成功的联合递减来处理此问题，确保最终合并的结构正确。 

另一种情况是没有为查询激活段。 如果海平面已经高于所有高度，则指针不会移动，答案仍保持先前的状态，这正确反映了没有新陆地出现。 

第三种微妙的情况是高度相等，阈值与它们完全匹配。 因为激活使用严格比较`>`，高度等于海平面的部分仍被淹没，防止过早形成岛屿并使计数与洪水的定义保持一致。
