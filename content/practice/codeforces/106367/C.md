---
title: "CF 106367C - 七荣町的指导"
description: "我们得到一棵有根树，其根为节点 1。每个叶子都位于相同的深度，因此该树在叶子深度方面是完美平衡的，尽管分支结构可以是任意的。 每只蝴蝶都附着在一个节点上，并在指定的时间消失。"
date: "2026-06-19T15:04:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106367
codeforces_index: "C"
codeforces_contest_name: "Whalica Cup (Round 2)"
rating: 0
weight: 106367
solve_time_s: 145
verified: true
draft: false
---

[CF 106367C - Shichieichou 的指导](https://codeforces.com/problemset/problem/106367/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，其根为节点 1。每个叶子都位于相同的深度，因此该树在叶子深度方面是完美平衡的，尽管分支结构可以是任意的。 

每只蝴蝶都附着在一个节点上，并在指定的时间消失。 Ao 从时间 0 的任何叶子开始，最终必须到达根。 从深度节点移动`d`深入`d - 1`总是花费一个单位时间。 

通常情况下，Ao 只能移动到父级。 一旦在旅途中，她可能会使用特殊的力量并从当前的节点移动到深处`d`到深度的任意节点`d - 1`。 

每当Ao访问一个节点的时候`t`，该节点上每只蝴蝶的消失时间至少为`t`可以收集。 

任务是选择起始叶子和可选的必杀技，以使收集的蝴蝶数量最大化。 

输入尺寸很大。 在所有测试用例中，节点总数和蝴蝶总数最多均为`2 · 10^5`。 任何检查每个叶子以及每个可能的跳跃位置的解决方案都太慢了。 我们需要每个测试用例接近线性的时间。 

一个微妙的观察是，节点的实际到达时间仅取决于其深度。 由于所有叶子都位于深度`H`, 深度节点`d`总是在某个时间被访问`H - d`，无论选择的路线如何。 这极大地简化了问题。 

一些边缘情况很容易被错误处理。 

考虑一只蝴蝶，当 Ao 到达时它就消失了。```
3 1
1 2
1 3
1 1
```叶子的深度为 1，因此在时间 1 到达根。根部的蝴蝶`t = 1`仍然可以收藏，因为条件是`current time ≤ ti`。 

另一个陷阱是特殊动作不能节省时间。 从深处`d`深入`d - 1`，普通父移动和特殊移动都花费一个单位。 特殊移动仅改变位置，而不改变到达时间。 

例如：```
    1
   / \
  2   3
 /     \
4       5
```从节点 4 跳转到节点 3 在时间 1 仍然达到深度 1。任何将跳转视为时间捷径的解决方案都会产生不正确的资格检查。 

第三个陷阱是忘记特殊动作是可选的。 有时，最佳路线只是普通的叶到根路径。 

## 方法

 暴力方法将枚举每个起始叶子、使用特殊移动的每个可能的深度以及下一个更高级别的每个目标节点。 对于每条候选路线，我们可以模拟旅程并计算收集到的蝴蝶。 

这在概念上是有效的，因为每个有效的旅程都可以完全按照这种方式描述。 不幸的是，叶子的数量可以是线性的`n`，并且可能的跳跃选择的数量也可以是线性的。 由此产生的复杂性很容易达到`O(n^2)`或者更糟，这是不可能的`2 · 10^5`节点。 

关键的观察结果是到达时间仅取决于深度。 

让`H`是共同的叶深度。 

节点上的蝴蝶`v`是可收藏的，如果```
ti ≥ H - depth(v)
```这个条件仅取决于节点和蝴蝶。 它不取决于所选择的路线。 

因此，我们可以预处理每个节点并计算：```
value(v) = number of butterflies at v that are collectible whenever v is visited
```原来的问题变得纯粹是结构性的。 

假设站在节点时使用必杀技`a`深度的`d`。 

在跳跃之前，Ao 沿着一条从某片叶子向上的路径到达`a`。 

跳跃后，Ao落在某个节点上`b`在深度`d - 1`然后沿着祖先链从`b`到根。 

收集到的节点分为两个独立的部分：

 1. 向下的链条`a`到一些叶子。 
2.从根部向上的链条`b`。 

由于这两个部分涉及不同的深度范围，因此它们的分数可以独立优化。 

这将问题转化为两个树动态规划计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) 或更糟 | O(n) | 太慢了|
 | 最佳| O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1. 以节点 1 为树的根并计算每个节点的深度。 
2. 求公共叶子深度`H`。 
3.对于每只蝴蝶`(a, t)`，检查是否```
t ≥ H - depth(a)
```如果为真，则增加`value(a)`一个。 

在此步骤之后，每个节点都会存储每当访问该节点时保证可以收集的蝴蝶数量。 
4. 计算```
prefix(v) = sum of value(x)
            along the root-to-v path
```使用DFS或BFS遍历。 
5. 对于每个深度`d`， 店铺```
bestPrefix[d] =
    maximum prefix(v)
    among all nodes at depth d
```如果跳跃落在深度`d`，这是从路线的根部分获得的最佳得分。 
6. 计算自下而上的DP：```
down(v) =
    maximum score of a path
    starting at v and ending at a leaf
```对于一片叶子：```
down(v) = value(v)
```对于内部节点：```
down(v) = value(v) + max(down(child))
```7. 考虑不使用特殊动作的旅程。 

任何这样的旅程都是从叶到根的路径。 

其得分等于`prefix(leaf)`。 

使用所有叶子中的最大值初始化答案。 
8. 考虑使用特殊动作的旅程。 

假设从节点进行跳转`v`在深度`d ≥ 1`。 

最好的叶面贡献是`down(v)`。 

最好的根端贡献是`bestPrefix[d - 1]`。 

总分是```
down(v) + bestPrefix[d - 1]
```使用所有非根节点上的最大值更新答案。 
9.输出最高分。 

### 为什么它有效

 每个深度访问过的节点`d`达到时间`H - d`，与路线无关。 因此，蝴蝶能否被收集只取决于它的节点和消失时间。 用节点权重替换蝴蝶可以准确地保留目标。 

如果从深度节点使用特殊移动`d`，路线分解为两个不相交的深度区间。 深度以下的部分`d`贡献一个叶到节点链，其最优为`down(v)`。 深度以上部分`d`贡献一个在一定深度结束的根到节点链`d - 1`节点，其最优值为`bestPrefix[d - 1]`。 

由于两个间隔使用不同的深度，因此它们永远不会重叠并且可以独立优化。 每一个有效的路径都对应于一个这样的分解，并且每一个分解都对应于一个有效的路径。 取所有可能的跳跃位置的最大值并考虑无跳跃的情况，保证了最佳答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n, m = map(int, input().split())

        g = [[] for _ in range(n + 1)]

        for _ in range(n - 1):
            u, v = map(int, input().split())
            g[u].append(v)
            g[v].append(u)

        parent = [0] * (n + 1)
        depth = [0] * (n + 1)

        order = [1]
        parent[1] = -1

        for v in order:
            for to in g[v]:
                if to == parent[v]:
                    continue
                parent[to] = v
                depth[to] = depth[v] + 1
                order.append(to)

        H = 0
        for v in range(2, n + 1):
            if len(g[v]) == 1:
                H = depth[v]
                break

        value = [0] * (n + 1)

        for _ in range(m):
            a, ti = map(int, input().split())
            if ti >= H - depth[a]:
                value[a] += 1

        prefix = [0] * (n + 1)
        best_prefix = [-10**18] * (H + 1)

        for v in order:
            if v == 1:
                prefix[v] = value[v]
            else:
                prefix[v] = prefix[parent[v]] + value[v]

            d = depth[v]
            if prefix[v] > best_prefix[d]:
                best_prefix[d] = prefix[v]

        down = value[:]

        for v in reversed(order):
            best_child = 0

            for to in g[v]:
                if to == parent[v]:
                    continue
                if down[to] > best_child:
                    best_child = down[to]

            down[v] = value[v] + best_child

        answer = 0

        for v in range(2, n + 1):
            if len(g[v]) == 1:
                answer = max(answer, prefix[v])

        for v in range(2, n + 1):
            d = depth[v]
            answer = max(answer, down[v] + best_prefix[d - 1])

        ans.append(str(answer))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```第一次遍历以树为根并计算深度。 由于所有叶子都具有相同的深度，因此找到任何叶子都会立即给出共同值`H`。 

蝴蝶处理阶段将原始的时间相关问题转换为节点权重。 在那之后，算法的其余部分永远不需要再次查看消失时间。`prefix[v]`存储整个根到-的分数`v`链。 记录每个深度的最大值使我们能够立即回答这个问题：“如果跳跃落在深度`d`，可用的最佳根端分数是多少？”

 自下而上的DP计算`down[v]`，通过选择下面最有利可图的叶子获得的最佳分数`v`。 该转换使用最大子值，因为任何根到叶路径只能继续通过一个子值。 

一个常见的错误是重复计算跳跃边界。 公式```
down(v) + bestPrefix[d - 1]
```避免了这种情况，因为这两块占据不同的深度。 深度节点`d`仅属于`down(v)`，而目的节点只属于前缀部分。 

## 工作示例

 ### 示例 1

 输入：```
3 2
1 2
1 3
3 0
1 1
```常见的叶深为`H = 1`。 

节点值：

 | 节点| 深度 | 所需时间 | 蝴蝶| 价值|
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | (1,1) | 1 |
 | 2 | 1 | 0 | 无 | 0 |
 | 3 | 1 | 0 | (3,0) | 1 |

 前缀值：

 | 节点| 前缀 |
 | --- | --- |
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 2 |

 下降值：

 | 节点| 下|
 | --- | --- |
 | 2 | 0 |
 | 3 | 1 |
 | 1 | 2 |

 最好的无跳跃路径是叶 3 到根，得分为 2。 

跳跃选项无法改善这一点。 

回答：`2`。 

这个例子证实了在消失时间准确到达仍然有效。 

### 示例 2

 输入：```
6 3
1 2
1 3
2 4
2 5
3 6
6 1
2 1
1 1
```常见的叶深为`H = 2`。 

节点值：

 | 节点| 深度 | 价值|
 | --- | --- | --- |
 | 1 | 0 | 0 |
 | 2 | 1 | 1 |
 | 6 | 2 | 1 |
 | 其他 | - | 0 |

 前缀值：

 | 节点| 前缀 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 1 |
 | 3 | 0 |
 | 4 | 1 |
 | 5 | 1 |
 | 6 | 1 |

 下降值：

 | 节点| 下|
 | --- | --- |
 | 6 | 1 |
 | 3 | 1 |
 | 2 | 1 |
 | 1 | 2 |

 使用从节点 6 到节点 2 的跳转来收集两个盈利区域：```
6 -> jump to 2 -> 1
```分数 = 2。 

答：`2`。 

这个例子说明了为什么特殊动作很有价值，尽管它不能节省时间。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每个节点和蝴蝶都被处理固定次数 |
 | 空间| O(n) | 图、深度、DP 数组和遍历顺序 |

 总和为`n`和`m`所有测试用例最多`2 · 10^5`，因此线性解很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old_stdout
    return out.getvalue().strip()

# sample-style tests
assert run(
"""1
3 2
1 2
1 3
3 0
1 1
"""
) == "2"

assert run(
"""1
6 3
1 2
1 3
2 4
2 5
3 6
6 1
2 1
1 1
"""
) == "2"

# minimum tree
assert run(
"""1
2 1
1 2
2 0
"""
) == "1"

# no butterflies
assert run(
"""1
3 0
1 2
1 3
"""
) == "0"

# jump strictly improves answer
assert run(
"""1
6 2
1 2
1 3
2 4
2 5
3 6
4 0
3 1
"""
) == "2"

# boundary: disappearance exactly at arrival time
assert run(
"""1
2 1
1 2
1 1
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 拥有一只蝴蝶的最小树 | 1 | 最小有效实例 |
 | 到处都没有蝴蝶| 0 | 空贡献处理 |
 | 严格跳跃提高分数| 2 | 必杀技的正确使用|
 | 消失时间等于到达时间| 1 | 包容性比较`≤`|
 | 样品式案例| 2, 2 | 核心功能|

 ## 边缘情况

 考虑平等边界：```
1
2 1
1 2
1 1
```叶深度为`H = 1`。 根被访问一次`1`。 蝴蝶也有时消失`1`，所以具有收藏价值。 预处理检查使用```
ti >= H - depth(node)
```这变成```
1 >= 1
```并正确数出蝴蝶的数量。 

现在考虑跳跃改变位置但不改变时间的情况：```
1
6 2
1 2
1 3
2 4
2 5
3 6
4 0
3 1
```节点 4 在深度 2 处贡献，节点 3 在深度 1 处贡献。将跳跃视为时间捷径的错误解决方案会计算出错误的到达时间。 该算法从不这样做。 到达时间仅由深度决定，因此两只蝴蝶都会正确计数，从而得出答案`2`。 

最后，考虑跳过跳转是最佳的情况：```
1
3 1
1 2
1 3
2 0
```从第 2 片叶子开始，已经收集了唯一的蝴蝶。 任何跳转都会访问不同的分支，并且无法提高分数。 该算法显式评估所有叶到根路径`prefix(leaf)`值，因此绝不会错过无跳跃最佳值。
