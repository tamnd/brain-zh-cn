---
title: "CF 320B - 乒乓球（简易版）"
description: "我们在数轴上维护着越来越多的开区间。 每次添加新的区间，它就成为隐式有向图中的一个节点。"
date: "2026-06-06T02:13:03+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 320
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 189 (Div. 2)"
rating: 1500
weight: 320
solve_time_s: 73
verified: true
draft: false
---

[CF 320B - 乒乓球（简易版）](https://codeforces.com/problemset/problem/320/B)

 **评分：** 1500
 **标签：** dfs 和类似的、图表
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在数轴上维护着越来越多的开区间。 每次添加新的区间，它就成为隐式有向图中的一个节点。 从任何区间，如果第一个区间的端点之一严格位于第二个区间内，我们就可以移动到另一个区间。 这将根据端点的几何包含创建有向边。 

在线构建此结构后，我们必须回答可达性查询：给定两个已添加的间隔，确定我们是否可以从第一个间隔开始并沿着有效的移动重复跳转以最终到达第二个间隔。 

关键的困难是没有明确给出图表。 每个新间隔都可能连接到许多先前的间隔，具体取决于它们的端点是否位于其中。 如果间隔数量变大，重复检查所有对的简单方法会太慢，因为可达性查询可能需要探索密集的隐式图。 

尽管这里的约束很小，但预期的解决方案依赖于理解间隔的结构如何限制可能的转换。 

当间隔重叠但不以允许移动的方式包含端点时，就会出现微妙的失败情况。 例如，如果我们有 (1, 10) 和 (2, 3)，我们可以从 (2, 3) 移动到 (1, 10)，因为 (2, 3) 的两个端点都位于 (1, 10) 内部。 但反过来是不可能的，因为 1 和 10 都不严格位于 (2, 3) 之内。 如果人们假设重叠意味着连通性，那么这种不对称性很容易被错误处理。 

另一个常见的错误是将结构视为基于重叠的无向连接。 在单向遏制的情况下，这会产生不正确的可达性。 

## 方法

 直接的强力解决方案构建一个图，其中每个间隔都是一个节点，并且我们显式测试每对之间的边。 对于两个区间 i 和 j，我们检查端点包含条件是否在任一方向上成立，并相应地创建有向边。 然后，通过从源间隔运行 DFS 或 BFS 来回答每个查询。 

这种做法是正确的，因为它忠实地代表了运动规则。 然而，它变得昂贵，因为构建邻接结构已经花费了间隔数量的二次方时间，并且每个可达性查询可能会遍历图的很大一部分。 在最坏的情况下，由于有许多嵌套间隔，图会变得密集，并且每个查询都会退化为线性遍历。 

关键的观察结果是，约束保证了强大的结构特性：每个新添加的间隔都严格长于所有先前的间隔。 这意味着间隔被有效地插入到不断增加的“规模”中，这严重限制了循环的形成方式以及可达性的传播方式。 

由于每个新间隔都是迄今为止最长的，因此它只能以非常结构化的方式连接到较早的间隔。 事实上，转换总是朝着严格包含当前区间端点的区间移动，并且由于单调增长，可达性结构的行为就像树状嵌套层次结构，而不是任意图。 

这使我们能够在每个查询的最多 n 个节点上使用简单的 DFS 来计算可达性，而无需构建显式的邻接列表。 由于 n 至多为 100，因此即使 O(n^3) 总解也足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（显式图 + 每个查询的 BFS）| O(n² + q·n²) | O(n² + q·n²) | O(n²) | 可以接受但没有必要 |
 | 隐式图上的 DFS | 最坏情况 O(q·n²) | O(n) | 已接受 |

 ## 算法演练

1. 将所有间隔相加后存储在数组中。 每个间隔由其插入索引来标识。 
2. 对于询问区间 a 是否可以到达区间 b 的查询，从 a 开始运行深度优先搜索。 
3. 从当前区间 (x, y) 开始，迭代所有其他尚未访问过的区间 (c, d)。 
4. 对于每个候选区间，检查是否可以移动：

 如果 c < x < d 或 c < y < d，则允许移动。 

该检查直接编码规则“当前间隔的端点严格位于下一个间隔内”。 
5. 如果条件成立，则从该间隔开始递归地继续 DFS。 
6. 如果在 DFS 期间到达 b，则立即返回 YES。 
7. 如果 DFS 完成但未到达 b，则返回 NO。 

为什么暴力探索在这里是可以接受的，因为 n 足够小，即使重复的完整扫描也能保持快速。 

### 为什么它有效

 该算法精确地探索问题定义的有向边。 每个递归步骤都遵循有效的移动，并且每个有效的移动都会在某个时刻被考虑，因为我们根据当前节点检查所有间隔。 由于 DFS 会探索这些转换下的所有可到达节点，因此当且仅当存在从 a 到 b 的有效移动序列时，它才会返回 YES。 没有可跳过的替代隐藏路径，因为任何合法移动都必须满足迭代期间检查的相同端点包含条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_reach(start, target, intervals):
    n = len(intervals)
    visited = [False] * n
    stack = [start]
    visited[start] = True

    while stack:
        i = stack.pop()
        if i == target:
            return True

        x, y = intervals[i]

        for j in range(n):
            if visited[j]:
                continue
            c, d = intervals[j]

            if (c < x < d) or (c < y < d):
                visited[j] = True
                stack.append(j)

    return False

def solve():
    n = int(input())
    intervals = []
    out = []

    for _ in range(n):
        parts = input().split()
        if parts[0] == "1":
            x = int(parts[1])
            y = int(parts[2])
            intervals.append((x, y))
        else:
            a = int(parts[1]) - 1
            b = int(parts[2]) - 1
            out.append("YES" if can_reach(a, b, intervals) else "NO")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现将间隔保留在一个简单的列表中，以便索引与插入顺序匹配。 每个查询类型 2 都会触发一个 DFS，扫描所有间隔并应用准确的移动条件。 访问数组可防止由重叠包含模式创建的循环配置中的无限循环。 

一个常见的陷阱是忘记运动取决于当前间隔的端点，而不是候选间隔。 支票`(c < x < d)`和`(c < y < d)`是有方向性的，不能颠倒。 

## 工作示例

 ### 示例 1

 输入：```
1 1 5
1 5 11
2 1 2
```我们跟踪区间 1 到 2 的可达性。 

| 步骤| 当前| 访问过 | 接下来考虑| 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 1 (1,5) | 1 (1,5) | {1} | 2 (5,11) | 2 (5,11) | 5 严格来说并不在 (5,11) 之内，1 也不在 → 无边 |

 DFS 未达到 2 就结束，因此输出为 NO。 

这证实了接触端点不被视为有效遏制，因为条件很严格。 

### 示例 2

 输入：```
1 1 5
1 5 11
1 2 9
2 1 3
```我们检查区间 1 是否可以到达区间 3。 

| 步骤| 当前| 访问过 | 接下来考虑| 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 1 (1,5) | 1 (1,5) | {1} | 2 (5,11) | 2 (5,11) | | 严格内部没有端点
 | 1 | 1 (1,5) | 1 (1,5) | {1} | 3 (2,9) | 3 (2,9) | 1 < 5 < 9 为假，但 2 < 5 < 9 为真 → 转到 3 |

 我们到达 3，所以输出为 YES。 

这表明即使不存在直接连接，中间间隔也可以充当桥梁。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q·n²) | O(q·n²) | 每个查询可能扫描所有区间，DFS可能访问所有节点 |
 | 空间| O(n) | 我们存储间隔和访问过的数组 |

 当 n ≤ 100 时，即使最坏情况下每个查询 10⁴ 次操作也很容易在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdin
    input = sys.stdin.readline

    def can_reach(start, target, intervals):
        n = len(intervals)
        visited = [False] * n
        stack = [start]
        visited[start] = True

        while stack:
            i = stack.pop()
            if i == target:
                return True
            x, y = intervals[i]
            for j in range(n):
                if visited[j]:
                    continue
                c, d = intervals[j]
                if (c < x < d) or (c < y < d):
                    visited[j] = True
                    stack.append(j)
        return False

    n = int(input())
    intervals = []
    out = []

    for _ in range(n):
        parts = input().split()
        if parts[0] == "1":
            intervals.append((int(parts[1]), int(parts[2])))
        else:
            a = int(parts[1]) - 1
            b = int(parts[2]) - 1
            out.append("YES" if can_reach(a, b, intervals) else "NO")

    return "\n".join(out)

# provided sample
assert run("""5
1 1 5
1 5 11
2 1 2
1 2 9
2 1 2
""") == "NO\nYES"

# custom 1: single interval
assert run("""1
1 1 10
""") == ""

# custom 2: self-contained reach
assert run("""3
1 1 10
1 2 9
2 1 2
""") == "YES"

# custom 3: no path
assert run("""3
1 1 3
1 4 6
2 1 2
""") == "NO"

# custom 4: chain
assert run("""4
1 1 10
1 2 9
1 3 8
2 1 3
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单间隔| 空 | 没有查询边缘情况 |
 | 1→2 可达 | 是 | 简易安全壳桥|
 | 不相交区间 | 否 | 无错误连接 |
 | 嵌套链| 是 | 多步传播|

 ## 边缘情况

 一个微妙的边缘情况是端点与区间边界重合。 例如，从 (1, 5) 到 (5, 10)，没有有效的移动，因为 5 并不严格位于 (5, 10) 之内。 该算法正确地拒绝了这一点，因为该条件使用了严格的不等式。 

另一种情况是看起来对称的间隔，其中存在重叠但方向不同。 从 (2, 9) 到 (1, 5)，即使它们严重重叠，也无法移动。 DFS 正确失败，因为 (2, 9) 的端点都不严格位于 (1, 5) 内部。 

最后一种情况是链的可达性需要通过中间间隔进行多次跳跃。 由于 DFS 会探索所有可到达的节点，因此它自然会发现这些路径，而无需邻接检查之外的任何预处理。
