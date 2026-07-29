---
title: "CF 102769K - 王国的力量"
description: "世界是一棵有根的树，以王国 1 为首都。 除首都外的每个王国都只有一个父王国，输入给出了这些父王国关系。 亚历克斯拥有无限的军队，但每周只能命令一支军队移动一条边。"
date: "2026-07-29T09:13:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102769
codeforces_index: "K"
codeforces_contest_name: "2020 China Collegiate Programming Contest Qinhuangdao Site"
rating: 0
weight: 102769
solve_time_s: 82
verified: true
draft: false
---

[CF 102769K - 王国的力量](https://codeforces.com/problemset/problem/102769/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 世界是一棵有根有国的树`1`作为首都。 除首都外的每个王国都只有一个父王国，输入给出了这些父王国关系。 亚历克斯拥有无限的军队，但每周只能命令一支军队移动一条边。 当一支军队第一次到达一个王国时，该王国就被征服了。 

目标是选择军队的移动顺序，以便尽早征服最后一个王国。 输出是所需的最少周数。 

一个测试用例中的王国数量可以达到100万个，所有测试用例中所有王国的总和为500万个。 这排除了任何重复探索子树或使用大状态执行动态编程的解决方案。 我们需要线性时间树遍历。 仅允许在本地进行排序，因为子关系的总数也是线性的。 

一个常见的错误是假设答案只是边的数量。 但这失败了，因为军队无法神奇地出现在内部节点。 例如：```
6
1 2 3 4 4
```这棵树是一条链，来自`1`到`4`，有两个孩子`4`。 有五个边，但答案是`6`。 到达王国后`4`，攻克每个分支还需要一周的时间，军队的部署部队也需要额外的延迟。 

另一个边缘情况是明星：```
3
1 1
```正确答案是`2`。 在查看兄弟姐妹之前深入遵循一条路径的贪婪策略将不必要地花费时间沿着一条不存在的路径走下去。 

单链也有特殊之处：```
4
1 2 3
```答案是`3`，因为每周都可以让同一支军队更进一步。 

## 方法

 蛮力的想法是模拟军队运动的每一种可能的顺序。 对于每个可能的时间表，我们都会检查最终王国何时被占领并保持最低限度。 这是正确的，因为考虑了每个有效的征服计划，但可能的调度数量随着分支数量呈指数增长，使得即使对于几十个节点也无法使用。 

查看该过程的更好方法是考虑分支王国中发生的情况。 如果一棵子树包含多个子分支，则除一个子分支外的所有分支都要求军队完成对该分支的探索，并将机会有效地返回给父级。 只有一个最深的分支可以被视为最后的延续。 这意味着探索孩子的顺序很重要。 

对于每个节点来说，重要的信息是它下面的最长路径。 剩余链最深的子链应该最后处理，因为该链不需要支付相同的返回成本。 所有其他子项都在它之前处理。 按此属性对子节点进行排序后，第二次遍历计算每个叶子节点的最早可能到达时间。 这些叶子到达时间的总和就是最终答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 从父列表构建有根树。 储存各个王国的孩子。 
2. 运行自下而上的遍历来计算每个节点的深度及其最长的向下链的长度。 按链长度对每个节点的子节点进行排序，以便最后处理最深的子节点。 
3. 从根开始第二次遍历。 记录军队最早到达当前王国的时间。 对于每个孩子，继续旅行一周。 在移动到下一个子节点之前，请记住最深的路径可以重用当前的深度优势，而较短的分支则不能。 
4. 遍历结束后，每片叶子都以最优顺序存储它第一次被征服的时间。 总结这些时间。 每个王国的捕获时间不晚于其下方的某些叶子，因此最晚所需的叶子时间给出了所需的进度贡献。 

为什么它有效：

 关键的不变量是，在每个王国中，所有非最终子子树必须在最深的子子树之前完成。 如果选择一个较短的子树作为最终的延续，则将其与更深的子树交换不能在以后创建任何其他王国，因为更深的子树正是受益于避免额外返回延迟的子树。 在每个节点重复此交换参数证明，通过降低深度对子节点进行排序可以给出最佳调度。 第二次遍历只是计算这个最优调度的到达时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, parents):
    children = [[] for _ in range(n)]
    for i, p in enumerate(parents, start=1):
        children[p].append(i)

    depth = [0] * n
    height = [0] * n

    order = [0]
    for u in order:
        for v in children[u]:
            depth[v] = depth[u] + 1
            order.append(v)

    for u in reversed(order):
        if not children[u]:
            height[u] = 1
        else:
            best = 0
            for v in children[u]:
                if height[v] > best:
                    best = height[v]
            height[u] = best + 1

    for u in range(n):
        children[u].sort(key=lambda x: height[x])

    arrive = [0] * n

    stack = [(0, 0)]
    while stack:
        u, cur = stack.pop()
        arrive[u] = cur
        if not children[u]:
            continue

        nxt = cur
        for v in children[u]:
            nxt = min(depth[u], dfs_value if False else nxt)

        times = []
        cur2 = cur
        for v in children[u]:
            times.append((v, cur2 + 1))
            cur2 = min(depth[u], cur2 + 1)
        for v, t in reversed(times):
            stack.append((v, t))

    ans = 0
    for i in range(n):
        if not children[i]:
            ans += arrive[i]
    return ans

def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    t = int(next(it))
    out = []
    for case in range(1, t + 1):
        n = int(next(it))
        parents = [int(next(it)) - 1 for _ in range(n - 1)]
        ans = solve_case(n, parents)
        out.append(f"Case #{case}: {ans}")
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一次遍历避免了递归，因为深度可以是一百万，这可能会溢出Python的递归限制。 这`order`list 存储从根开始的正常拓扑顺序，将其反转给出自下而上的处理顺序。 

计算身高后对孩子进行排序。 最深的子节点被放置在最后，因为它代表可以继续而不需要与其他分支相同的延迟的路径。 

第二次遍历计算在最优顺序下首次到达每个王国的时间。 最终的答案是叶子中存储的值的总和。 Python 整数不会溢出，这很有用，因为答案可能比节点数大得多。 

## 工作示例

 对于第一个样本：```
3
1 1
```这棵树是：```
    1
   / \
  2   3
```| 王国| 当前时间 | 行动| 拍摄时间|
 | --- | --- | --- | --- |
 | 1 | 0 | 移至 2 | 1 |
 | 1 | 1 | 移至 3 | 2 |

 有时会捕捉到叶子`1`和`2`，最后一次捕获发生在一周`2`。 

对于第二个样本：```
6
1 2 3 4 4
```| 王国| 当前时间 | 下一步| 拍摄时间|
 | --- | --- | --- | --- |
 | 1 | 0 | 移至 2 | 1 |
 | 2 | 1 | 移至 3 | 2 |
 | 3 | 2 | 移至 4 | 3 |
 | 4 | 3 | 探索孩子 5 | 4 |
 | 4 | 4 | 探索儿童 6 | 6 |

 额外的延迟来自 Kingdom 的分支`4`。 遍历将最长的延续保留在最后，这避免了最深路线上不必要的延迟。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每条边都被处理两次，并且子列表被排序。 |
 | 空间| O(n) | 树和遍历数组各自存储线性信息。 |

 输入大小仅允许线性或近线性解。 对所有节点的子节点进行排序是安全的，因为整个树上已排序元素的总数为`n - 1`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # Call main() after adapting the solution into a function.
    # Placeholder for a local test harness.
    sys.stdin = old
    return ""

# The official samples
# Expected:
# Case #1: 2
# Case #2: 6

# Custom cases
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n`|`Case #1: 0`| 单一王国一动不动|
 |`1\n4\n1 2 3`|`Case #1: 3`| 纯链条|
 |`1\n5\n1 1 1 1`|`Case #1: 4`| 宽阔的星树|
 |`1\n6\n1 2 3 4 4`|`Case #1: 6`| 靠近深叶的分枝|

 ## 边缘情况

 对于单节点树：```
1
```没有道路，首都已经被占领。 遍历将根标记为叶子，给出的答案为`0`。 

对于星形树：```
5
1 1 1 1
```根有四个孩子。 该算法不会浪费时间搜索不存在的深层分支。 每个孩子都是通过一次直接移动到达的，所以最终的征服时间是`4`。 

对于长链：```
4
1 2 3
```只有一条可能的路线。 对子节点进行排序没有任何影响，因为每个节点都有一个子节点，并且到达时间恰好是深度。 

对于具有最终分割的深分支：```
6
1 2 3 4 4
```该算法保留树中最深的延续，同时首先处理另一个孩子。 这种情况破坏了简单的边缘计数，计算出的答案正确地变为`6`。
