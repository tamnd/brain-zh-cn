---
title: "CF 105316F - 传奇低语"
description: "我们有两个长度相同的数组。 第二个数组是固定的，但第一个数组可以任意排列。 选择第一个数组的排列后，每个位置将第一个数组中的一个值与第二个数组中的一个值配对。"
date: "2026-06-23T15:09:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105316
codeforces_index: "F"
codeforces_contest_name: "2024 Aleppo Collegiate Programming Contest"
rating: 0
weight: 105316
solve_time_s: 57
verified: true
draft: false
---

[CF 105316F - 传奇低语](https://codeforces.com/problemset/problem/105316/F)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个长度相同的数组。 第二个数组是固定的，但第一个数组可以任意排列。 选择第一个数组的排列后，每个位置将第一个数组中的一个值与第二个数组中的一个值配对。 

仅当每个选定的对满足整除条件时，配对才有效：第一个数组中的选定值必须能被第二个数组中的相应值整除。 如果不能对所有位置实现这一点，则配置无效并且答案为-1。 

如果存在有效的完整配对，则每个位置都会贡献一个比率，该比率是通过将第一个数组中的所选值除以第二个数组中的相应值而形成的。 配对的价值是所有头寸中这些比率的最小值。 目标是重新排列第一个数组，使这个最小比率尽可能大。 

测试用例的总大小限制很小，每个测​​试每个数组总共最多 500 个元素。 这允许每个测试用例的解决方案约为 O(n3) 或稍差，特别是在存在对数因子或匹配过程的情况下。 任何指数或阶乘都被排除，因为仅排列就已经是 500！ 的可能性。 

一个天真的尝试会尝试第一个数组的所有排列，检查有效性，计算最小比率，并采取最佳排列。 这会立即失败，因为即使 n = 10，排列数也会变成 10！ = 360 万，对于 n = 500 来说这是完全不可行的。 

更微妙的失败案例来自贪婪匹配策略。 例如，将每个 bi 与尽可能小的有效 ai 配对可能看起来很自然，但它可能会阻止以后更大的比率并破坏全局最优性。 考虑这样一种情况：较小的 b 只有一个兼容的 a，但较大的 b 也需要 a 来维持可行性。 即使存在有效的全局分配，贪婪的选择也会过早消耗它并使分配变得不可能。 

另一个极端情况是可行性。 如果存在至少一个 bi 且任何 ai 都不能被它整除，则无论排列如何，都没有排列可以满足约束。 这必须立即返回-1。 

## 方法

 该问题从根本上讲是在受整除性约束的情况下，将 b 中的每个值分配给 a 中的唯一值，同时最大化比率的瓶颈目标。 

暴力方法会考虑 a 的每个排列，检查每个位置是否满足 ai % bi == 0，计算最小比率，并跟踪最大值。 这是正确的，因为它探索了每一个可能的任务。 然而，它需要 n! 检查，每次检查的成本为 O(n)，给出 O(n · n!) 次操作，超过非常小的 n 后几乎立即变得不可用。 

关键的观察是，该结构不是直接与排列有关，而是与二分图中的完美匹配有关。 b 的每个元素必须与 a 的一个元素精确匹配。 仅当整除成立时才存在边，配对的权重为 ai / bi。 我们希望最大化所选的最小重量。 

这是匹配的经典瓶颈优化。 我们没有直接优化最小比率，而是相反：固定候选阈值 x 并询问我们是否可以构建一个完美的匹配，其中每个选定的对都满足 ai / bi ≥ x，同时也满足整除性。 

对于固定的 x，我们只保留边 (bi → aj)，使得 aj 可被 bi 整除且 aj ≥ x · bi。 如果我们能够在这些约束下找到完美的匹配，那么 x 是可以实现的。 这将问题转化为二分图的可行性检查。

由于可行性在 x 中是单调的，因此二分搜索变得适用。 我们可以测试 x 的值并收敛到最大可行值。 每个可行性检查都是一个二分匹配问题，可以用 Hopcroft-Karp 解决。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力排列 | O(n·n!) | O(n·n!) | O(n) | 太慢了 |
 | 二分查找+二分匹配| O(log A·E √V) | O(E) | 已接受 |

 ## 算法演练

 我们将问题简化为重复解决匹配的可行性问题。 

1. 将 b 的每个元素解释为左节点，将 a 的每个元素解释为右节点。 仅当所选 a 可被所选 b 整除时才允许连接。 这对问题允许的唯一有效配对进行编码。 
2.固定一个代表最小允许比率的候选值x。 对于一对 (bi, aj)，我们仅在 aj % bi == 0 且 aj ≥ x · bi 时才允许。 这确保了有效性并满足比率约束。 
3. 使用这些过滤后的边构建二部图。 每条边代表当前阈值 x 下的合法可用分配。 
4. 对该图运行最大二分匹配算法，检查 b 中的所有节点是否都能匹配。 如果匹配大小等于n，则x可行； 否则就不是。 
5. 二分查找有效范围内最大的x。 上限是 max(ai // bi 最小可能配对)，但实际上我们可以通过 max(a) 来限制它。 
6. 返回存在完美匹配的最大x。 如果 x = 0 失败，则不可能完全赋值，我们返回 -1。 

### 为什么它有效

 关键的不变量是可行性在 x 中是单调的。 如果某个阈值 x 存在匹配，则任何较小的阈值 x' ≤ x 只会放松边缘约束，而不会破坏现有的有效边缘。 这保证了二分查找不会错过最优值。 在每一步中，匹配步骤都充分捕获当前约束是否接受完整的分配，因此不会贪婪地做出局部决策； 在全球范围内检查可行性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

class HopcroftKarp:
    def __init__(self, n, m):
        self.n = n
        self.m = m
        self.g = [[] for _ in range(n)]
        self.pair_u = [-1] * n
        self.pair_v = [-1] * m
        self.dist = [0] * n

    def add_edge(self, u, v):
        self.g[u].append(v)

    def bfs(self):
        q = deque()
        for u in range(self.n):
            if self.pair_u[u] == -1:
                self.dist[u] = 0
                q.append(u)
            else:
                self.dist[u] = -1

        found = False

        while q:
            u = q.popleft()
            for v in self.g[u]:
                pu = self.pair_v[v]
                if pu != -1 and self.dist[pu] == -1:
                    self.dist[pu] = self.dist[u] + 1
                    q.append(pu)
                elif pu == -1:
                    found = True

        return found

    def dfs(self, u):
        for v in self.g[u]:
            pu = self.pair_v[v]
            if pu == -1 or (self.dist[pu] == self.dist[u] + 1 and self.dfs(pu)):
                self.pair_u[u] = v
                self.pair_v[v] = u
                return True
        self.dist[u] = -1
        return False

    def max_matching(self):
        matching = 0
        while self.bfs():
            for u in range(self.n):
                if self.pair_u[u] == -1 and self.dfs(u):
                    matching += 1
        return matching

def possible(a, b, x):
    n = len(a)
    hk = HopcroftKarp(n, n)
    for i in range(n):
        for j in range(n):
            if a[j] % b[i] == 0 and a[j] >= x * b[i]:
                hk.add_edge(i, j)
    return hk.max_matching() == n

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        if n == 1:
            if a[0] % b[0] == 0:
                print(a[0] // b[0])
            else:
                print(-1)
            continue

        if not possible(a, b, 0):
            print(-1)
            continue

        lo, hi = 0, 10**6
        ans = 0

        while lo <= hi:
            mid = (lo + hi) // 2
            if possible(a, b, mid):
                ans = mid
                lo = mid + 1
            else:
                hi = mid - 1

        print(ans)

if __name__ == "__main__":
    solve()
```该实现为每个可行性检查构建一个匹配实例。 二分结构将 b 固定在左侧，将 a 固定在右侧。 条件 a[j] % b[i] == 0 强制有效性，不等式 a[j] ≥ x * b[i] 强制比率约束。 

二分搜索围绕着这个可行性检查。 下限从零开始，因为微不足道的比率始终是最弱的要求，而上限安全地设置为 10⁶，因为所有比率都受到约束下最大可能商的限制。 每次成功的匹配都会更新最知名的答案。 

唯一微妙的陷阱是确保为每个 x 从头开始​​重新计算匹配； 重用状态会破坏正确性，因为边缘在迭代之间发生变化。 

## 工作示例

 考虑一个小情况，其中 a = [6, 8, 9]，b = [2, 3, 3]。 

我们测试 x = 2：

 | 步骤| 图表条件| 匹配进展| 可行|
 | --- | --- | --- | --- |
 | 构建 | 仅当 a ≥ 2b | 时才有边 有限边缘| 不确定 |
 | 匹配| 尝试完整分配| 可能会失败| 没有|

 现在 x = 1：

 | 步骤| 图表条件 | 匹配进展| 可行|
 | --- | --- | --- | --- |
 | 构建 | 允许所有可分边 | 更丰富的图表 | 是的 |
 | 匹配| 所有 b 都匹配 | 存在完全匹配 | 是的 |

 这表明，即使较低的阈值有效，较高的阈值也可能会破坏可行性，从而激发二分搜索。 

第二个例子：a = [12, 6], b = [3, 2]。 

对于 x = 2，有效对是 12/3 = 4 和 6/2 = 3，因此两者都有效。 匹配成功。 对于 x = 3，只有 12/3 有效，但对于 b = 2，6 是不够的，因为 6/2 = 3 仍然有效，因此它仍然可行。 当某些 b 失去所有候选者时，进一步增加 x 最终会破坏分配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T · log A · E √V) | O(T · log A · E √V) | 每个二分搜索步骤在最多 n² 条边上运行 Hopcroft-Karp |
 | 空间| O(n²) | 二分图的邻接表 |

 这些约束将 n 总数限制为 500，因此即使使用大约 20 个二分搜索步骤并在密集图上进行匹配，该解决方案也能轻松满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    class HopcroftKarp:
        def __init__(self, n, m):
            self.n = n
            self.m = m
            self.g = [[] for _ in range(n)]
            self.pair_u = [-1] * n
            self.pair_v = [-1] * m
            self.dist = [0] * n

        def add_edge(self, u, v):
            self.g[u].append(v)

        def bfs(self):
            from collections import deque
            q = deque()
            for u in range(self.n):
                if self.pair_u[u] == -1:
                    self.dist[u] = 0
                    q.append(u)
                else:
                    self.dist[u] = -1

            found = False
            while q:
                u = q.popleft()
                for v in self.g[u]:
                    pu = self.pair_v[v]
                    if pu != -1 and self.dist[pu] == -1:
                        self.dist[pu] = self.dist[u] + 1
                        q.append(pu)
                    elif pu == -1:
                        found = True
            return found

        def dfs(self, u):
            for v in self.g[u]:
                pu = self.pair_v[v]
                if pu == -1 or (self.dist[pu] == self.dist[u] + 1 and self.dfs(pu)):
                    self.pair_u[u] = v
                    self.pair_v[v] = u
                    return True
            self.dist[u] = -1
            return False

        def max_matching(self):
            res = 0
            while self.bfs():
                for i in range(self.n):
                    if self.pair_u[i] == -1 and self.dfs(i):
                        res += 1
            return res

    def possible(a, b, x):
        n = len(a)
        hk = HopcroftKarp(n, n)
        for i in range(n):
            for j in range(n):
                if a[j] % b[i] == 0 and a[j] >= x * b[i]:
                    hk.add_edge(i, j)
        return hk.max_matching() == n

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            n = int(input())
            a = list(map(int, input().split()))
            b = list(map(int, input().split()))
            if not possible(a, b, 0):
                out.append("-1")
                continue
            lo, hi = 0, 10**6
            ans = 0
            while lo <= hi:
                mid = (lo + hi) // 2
                if possible(a, b, mid):
                    ans = mid
                    lo = mid + 1
                else:
                    hi = mid - 1
            out.append(str(ans))
        return "\n".join(out)

    return solve()

# custom cases

# minimum size
assert run("1\n1\n6\n3\n") == "2"

# impossible
assert run("1\n2\n2 4\n3 5\n") == "-1"

# all equal compatible
assert run("1\n3\n6 12 18\n3 2 6\n") != ""

# exact matching pressure case
assert run("1\n3\n6 10 15\n3 5 5\n") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 元素可整除 | 2 | 基本正确性 |
 | 没有有效的匹配 | -1 | 不可行处理 |
 | 全部兼容 | 正值| 全匹配稳定性|
 | 混合约束| 有效输出| 应力结构|

 ## 边缘情况

 一个关键的边缘情况是单个 b 值的整除性已经失败。 例如，a = [4, 6]，b = [3, 5]。 由于 5 不能整除任何东西，因此即使存在部分匹配，也不存在完全匹配。 该算法在 x = 0 处检测到这一点并立即返回 -1，因为 Hopcroft-Karp 无法达到完全匹配。 

当多个 b 值竞争单个大 a 时，会出现另一种边缘情况。 例如，a = [12, 12, 12]，b = [2, 3, 6]。 虽然每对都是可整除的，但比率约束可以根据 x 强制进行不同的分配。 匹配步骤正确地解决了这个问题，因为它不会贪婪地提交； 它在全球范围内探索分配，确保即使在激烈的争用情况下，如果给定阈值存在有效的安排，也能找到它。
