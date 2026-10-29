---
title: "CF 1487E - 便宜的晚餐"
description: "我们有四层物品。 第一层包含第一道菜，第二层包含第二道菜，第三层包含饮料，第四层包含甜点。 每件物品都有成本。 在每对相邻层之间，禁止进行某些组合。"
date: "2026-06-10T23:01:56+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "graphs", "greedy", "implementation", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1487
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 104 (Rated for Div. 2)"
rating: 2000
weight: 1487
solve_time_s: 144
verified: true
draft: false
---

[CF 1487E - 便宜的晚餐](https://codeforces.com/problemset/problem/1487/E)

 **评级：** 2000
 **标签：** 暴力破解、数据结构、图、贪心、实现、排序、两个指针
 **求解时间：** 2m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有四层物品。 

第一层包含第一道菜，第二层包含第二道菜，第三层包含饮料，第四层包含甜点。 每件物品都有成本。 

在每对相邻层之间，禁止进行某些组合。 第一道菜可能与某些第二道菜不相容，第二道菜可能与某些饮料不相容，并且饮料可能与某些甜点不相容。 

我们必须从每一层中选择一个项目。 必须允许所选序列中的每个相邻对。 在所有有效的晚餐中，我们希望总成本尽可能最低。 

查看问题的最自然方式是使用分层图。 每个项目都是一个顶点。 边缘仅存在于相邻层之间，并且其中一些边缘被删除，因为它们是禁止的。 我们需要从第 1 层开始到第 4 层结束的最便宜的路径，其中路径的成本是其顶点成本的总和。 

约束完全决定了解决方案的方向。 每层最多可以包含 150,000 个项目，而每组禁止对最多包含 200,000 个条目。 层之间的二次算法是不可能的。 即使检查两层之间的所有对也需要粗略地$150000^2$的操作，远远超出了极限。 

一个有用的观察是，与可能的对的数量相比，禁止对的数量相对较小。 输入未描述所有允许的连接。 相反，它只列出了不好的。 这强烈建议围绕禁止集而不是围绕所有可能的边缘构建解决方案。 

一些边缘情况很容易被错误处理。 

考虑一个层，其中每个项目都变得无法访问。```
Layer A costs: [1]
Layer B costs: [2]
Forbidden: (A1,B1)
```不存在有效的转换。 B 层中该项目的正确值为“不可能”。 如果我们不小心保留了它的原始成本，后面的层可能会错误地通过它构建解决方案。 

另一种微妙的情况发生在最便宜的前身被禁止但更昂贵的前身可用时。```
Previous layer values: [1, 5]
Current item forbids predecessor 1
```该项目的答案是 5 加上其自身成本，而不是无穷大。 只检查全局最便宜的前身的解决方案将会失败。 

第三个重要的情况是某个项目的所有前任都被禁止。```
Previous layer values: [3, 7]
Forbidden predecessors: {1, 2}
```该项目必须变得无法访问。 任何忘记检测这种情况的实现都可能会意外地重用无效值。 

## 方法

 蛮力方法会尝试所有可能的晚餐。 

对于每第一道菜，尝试每第二道菜。 对于每对有效的饮料，尝试每种饮料。 对于每个有效的三重，尝试每种甜点。 每当允许所有相邻对时，计算总成本并保持最小值。 

这种方法是正确的，因为它明确地检查了每顿有效的晚餐。 不幸的是，它的复杂性是$$O(n_1 n_2 n_3 n_4)$$它可以大到$$150000^4$$并且是完全不可行的。 

我们需要利用问题的结构。 

假设我们已经知道一层中每个项目的最便宜的可实现成本。 我们想要计算下一层中每个项目的最便宜的可实现成本。 

对于固定项目$v$在下一层，$$dp[v] = cost[v] + \min(dp[u])$$超过所有前辈$u$不被禁止的$v$。 

困难在于有效地找到最小值。 

一个幼稚的实现会扫描所有前辈的每个项目。 这又变成了二次方。 

关键的观察结果是，每个项目总体上仅禁止相对较少数量的前任。 如果我们按成本对所有前驱值进行排序，那么对于给定的项目，我们可以从最便宜到最贵遍历排序列表，并选择第一个不被禁止的前驱。 

为什么这样有效？ 

每个项目仅存储其被禁止的前辈。 禁止对的数量最多为200,000。 由于排序后的前趋列表由所有项目共享，因此检查候选前趋是否被禁止只是哈希集查找。 

对于每个项目，我们搜索已排序的前趋列表，直到找到第一个允许的前趋。 因为禁止对的总数很小，所以这个过程足够快。 

我们执行此转换三次：

 1. 第一道菜→第二道菜。 
2.第二道菜→饮料。 
3.饮料→甜点。 

最后一次变换后，答案就是甜点层中的最小可达值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n_1 n_2 n_3 n_4)$|$O(1)$| 太慢了|
 | 最佳|$O((N+M)\log N)$|$O(N+M)$| 已接受 |

 这里$N=n_1+n_2+n_3+n_4$和$M=m_1+m_2+m_3$。 

## 算法演练

 假设我们知道上一层中所有项目的最佳可实现成本。 

我们需要一个程序来计算下一层的最佳可实现成本。 

### 过渡程序

 1. 将上一层的所有项目按照当前的 DP 值排序。 
2. 对于当前层中的每个项目，存储禁止的前辈集合。 
3. 独立处理当前层的各个项目。 
4. 按从最便宜到最贵的顺序扫描排序的前任列表。 
5. 查找索引不存在于当前项的禁止集中的第一个前驱。 
6. 如果存在这样的前任物品，则将其 DP 值添加到当前物品自身的成本中。 
7. 如果不存在前任项，则使用非常大的值将当前项标记为不可到达。 

### 完整算法

 1. 将第一层的 DP 值初始化为其成本。 
2. 应用从第 1 层到第 2 层的转换过程。 
3. 应用从第 2 层到第 3 层的转换过程。 
4. 应用从第 3 层到第 4 层的转换过程。 
5. 取第四层的最小DP值。 
6. 如果最小值为无穷大，则输出`-1`。 否则输出最小值。 

### 为什么它有效

 对于当前层中的任何项目，以该项目结束的每个有效晚餐都必须经过某个允许的前任。 

已排序的前趋列表以 DP 递增顺序检查前趋。 第一个未被禁止的前驱正是允许的具有最小DP值的前驱。 

因此转换计算$$cost[v]+\min_{\text{allowed }u} dp[u]$$这正是 item 的最优值$v$。 

由于每一层都是根据前一层的正确值计算的，归纳表明所有 DP 值都保持最优。 甜点节点中最后的最低限度正是最便宜的有效晚餐。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

n1, n2, n3, n4 = map(int, input().split())

a = list(map(int, input().split()))
b = list(map(int, input().split()))
c = list(map(int, input().split()))
d = list(map(int, input().split()))

def build(prev_dp, cur_costs):
    m = int(input())

    bad = [set() for _ in range(len(cur_costs))]
    for _ in range(m):
        x, y = map(int, input().split())
        bad[y - 1].add(x - 1)

    order = sorted(range(len(prev_dp)), key=lambda i: prev_dp[i])

    res = [INF] * len(cur_costs)

    for i in range(len(cur_costs)):
        for p in order:
            if p not in bad[i]:
                if prev_dp[p] < INF:
                    res[i] = cur_costs[i] + prev_dp[p]
                break

    return res

dp2 = build(a, b)
dp3 = build(dp2, c)
dp4 = build(dp3, d)

ans = min(dp4)

print(-1 if ans >= INF else ans)
```实现直接遵循动态规划公式。 

数组传递为`prev_dp`已经包含上一层中每个项目的最低可实现成本。 这`build`函数计算下一层的DP值。 

每个当前层项目将其禁止的前辈存储在哈希集中。 会员测试成为$O(1)$平均而言。 

排序后的数组`order`是关键的优化。 它列出了从最小 DP 值到最大的前驱索引。 当处理当前项时，我们搜索此列表，直到遇到不被禁止的前项。 由于列表已排序，该前任自动成为允许的最便宜的。 

支票`prev_dp[p] < INF`防止无法到达的状态被用作有效的前驱状态。 

输入中的索引从 1 开始，而 Python 列表从 0 开始。 当读取禁止对时立即执行转换。 

价值`INF = 10**18`安全地超过每一个可能的有效答案。 晚餐费用最多就是$4 \times 10^8$，因此不存在可达状态和不可达状态之间混淆的风险。 

## 工作示例

 ### 示例 1

 输入：```
4 3 2 1
1 2 3 4
5 6 7
8 9
10
...
```读完第一层后：

 | 项目 | DP |
 | --- | --- |
 | A1 | 1 |
 | A2 | 2 |
 | A3| 3 |
 | A4| 4 |

 过渡到第二门课程：

 | 第二道菜 | 禁止的第一道菜| 最便宜的允许前身| DP |
 | --- | --- | --- | --- |
 | B1 | {1} | A2 (2) | 7 |
 | B2 | {1} | A2 (2) | 8 |
 | B3 | {} | A1 (1) | 8 |

 过渡到饮料：

 | 喝| 禁止的第二道菜| 最便宜的允许前身| DP |
 | --- | --- | --- | --- |
 | C1 | {3} | B1 (7) | 15 | 15
 | C2 | {3} | B1 (7) | 16 | 16

 过渡到甜点：

 | 甜点| 禁止饮酒 | 最便宜的允许前身| DP |
 | --- | --- | --- | --- |
 | D1 | {1} | C2 (16) | 26 | 26

 最终答案：**26**。 

这条痕迹显示了中心思想。 Whenever the cheapest predecessor is forbidden, the algorithm automatically falls through to the next cheapest valid predecessor.

 ### 不可能的例子```
1 1 1 1
1
2
3
4
1
1 1
0
0
```第一次转换：

 | 第二道菜 | 禁忌前辈 | 结果 |
 | --- | --- | --- |
 | B1 | {A1} | 信息 |

 第二次转变：

 | 喝| 最便宜的前任|
 | --- | --- |
 | C1 | 无法到达 |

 结果依然`INF`。 

第三次转变：

 | 甜点| 最便宜的前任|
 | --- | --- |
 | D1 | 无法到达 |

 结果依然`INF`。 

The minimum value in the final layer is still infinity, so the answer is`-1`。 

This example demonstrates propagation of unreachable states through later layers.

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((N+M)\log N)$| 每层排序占主导地位，禁止检查是哈希查找 |
 | 空间|$O(N+M)$| DP 阵列加上禁止对集 |

 物品总数最多为 600,000 个，禁对总数最多为 600,000 个。 该算法执行三个排序操作并显式存储禁止关系。 时间和记忆都在限制范围之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    INF = 10**18

    n1, n2, n3, n4 = map(int, input().split())

    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    c = list(map(int, input().split()))
    d = list(map(int, input().split()))

    def build(prev_dp, cur_costs):
        m = int(input())
        bad = [set() for _ in range(len(cur_costs))]

        for _ in range(m):
            x, y = map(int, input().split())
            bad[y - 1].add(x - 1)

        order = sorted(range(len(prev_dp)), key=lambda i: prev_dp[i])

        res = [INF] * len(cur_costs)

        for i in range(len(cur_costs)):
            for p in order:
                if p not in bad[i]:
                    if prev_dp[p] < INF:
                        res[i] = cur_costs[i] + prev_dp[p]
                    break

        return res

    dp2 = build(a, b)
    dp3 = build(dp2, c)
    dp4 = build(dp3, d)

    ans = min(dp4)
    return str(-1 if ans >= INF else ans)

# custom minimum case
assert run(
"""1 1 1 1
1
2
3
4
0
0
0
"""
) == "10"

# impossible immediately
assert run(
"""1 1 1 1
1
2
3
4
1
1 1
0
0
"""
) == "-1"

# all equal costs
assert run(
"""2 2 2 2
5 5
5 5
5 5
5 5
0
0
0
"""
) == "20"

# cheapest predecessor forbidden
assert run(
"""2 1 1 1
1 100
5
7
9
1
1 1
0
0
"""
) == "121"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 每层中的单个项目 | 10 | 10 最小有效实例 |
 | 仅禁止连接 | -1 | 无法到达的传播 |
 | 所有成本均等 | 20 | 多重最优解|
 | 最便宜的前任禁止| 121 | 121 正确回退到第二好的前任|

 ## 边缘情况

 考虑一个项目禁止所有前任项目的情况。```
Previous DP: [3, 7]
Forbidden predecessors: {1, 2}
```排序后的前驱顺序是`[3, 7]`。 该算法检查这两个条目，发现这两个条目都是禁止的，并且从不更新结果。 该物品的价值仍然存在`INF`，这正确地将其标记为无法访问。 

考虑最便宜的前驱被禁止但存在另一个有效前驱的情况。```
Previous DP: [1, 5, 10]
Forbidden predecessors: {1}
```该算法检查 DP 值`1`，因为禁止而拒绝它，然后检查 DP 值`5`并接受它。 The resulting transition uses cost`5`，这正是所有允许的前辈中的最小值。 

考虑整个层中的所有项目都变得无法访问的情况。```
Layer 1: [1]
Layer 2: [2]
Forbidden: (1,1)
```第 2 层中唯一的项目接收值`INF`。 When later transitions are computed, the condition`prev_dp[p] < INF`防止使用这个无法访问的项目。 不可能性正确地传播到最终答案，即成为`-1`。
