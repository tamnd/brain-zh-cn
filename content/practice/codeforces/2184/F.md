---
title: "CF 2184F-樱桃树"
description: "我们有一棵有根的树，它的每片叶子都含有一颗樱桃。 在顶点 v 执行的摇动会使樱桃从 v 子树内的每片叶子上掉落。樱桃掉落后，它绝不能受到另一次摇动的影响。"
date: "2026-06-07T21:40:27+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "graphs", "trees"]
categories: ["algorithms"]
codeforces_contest: 2184
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1072 (Div. 3)"
rating: 1900
weight: 2184
solve_time_s: 224
verified: true
draft: false
---

[CF 2184F - 樱桃树](https://codeforces.com/problemset/problem/2184/F)

 **评级：** 1900
 **标签：** dfs 和类似的、dp、图、树
 **求解时间：** 3m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根的树，它的每片叶子都含有一颗樱桃。 

在顶点进行摇动`v`使樱桃从子树内的每片叶子上落下`v`。 一旦樱桃落下，它就不能再受到另一次摇晃的影响。 如果任一叶子属于两个不同的摇动，则该过程无效。 

目标是收集所有樱桃并使用可被三整除的次数的奶昔。 

该树最多包含`2·10^5`所有测试用例的顶点。 任何重复扫描子树或尝试多种顶点组合的算法都会立即被排除。 对于这个输入大小，我们需要每个测试用例接近线性时间。 

棘手的部分是了解哪些顶点集可以同时摇动。 

假设我们摇动一个顶点并摇动它的后代之一。 那么后代子树中的每个叶子都会受到两次影响，一次受到祖先的影响，一次受到后代的影响。 那是被禁止的。 

因此，所选择的顶点必须形成相对于祖先关系的反链。 每片叶子必须恰好属于一个选定的子树。 

一些边缘情况很容易被误解。 

考虑一棵只有两片叶子的树：```
1
├─2
└─3
```覆盖所有叶子的唯一有效方法是：```
{1}      -> 1 shake
{2,3}    -> 2 shakes
```两个计数都不能被三整除，所以答案是`NO`。 

另一个重要的情况是单叶子树。```
1
└─2
```叶子必须以某种方式被覆盖。 要么我们摇动顶点`1`或顶点`2`。 我们不能让子树不被覆盖并希望某些兄弟做出贡献，因为每个叶子都需要单独覆盖。 

第三种微妙的情况是当几个子子树每个都有多个有效的震动计数时。 我们对确切的数字不感兴趣。 由于只有被三整除才重要，所以保持计数模三就足够了。 忽略这一观察会导致状态数量激增。 

## 方法

 暴力方法会尝试每个顶点子集，检查所选顶点是否形成所有叶子的有效覆盖，然后测试所选顶点的数量是否可以被三整除。 

这是正确的，但完全不切实际。 一棵树与`n = 2·10^5`顶点有`2^n`子集，这远远超出了任何可以处理的范围。 

有效解决方案的结构给出了更好的方向。 

关注单根子树。 

对于一个顶点`v`，只有两种可能。 

要么我们动摇`v`本身。 然后，其子树中的每片叶子都会立即被覆盖，并且不会动摇任何后代。 

或者我们不动摇`v`。 然后每个子子树必须独立地覆盖它自己的所有叶子。 

这自然就创建了一个树DP。 

让`D[v]`是一组可能的摇动计数模三，可以覆盖子树内的所有叶子`v`。 

对于一片叶子，唯一的可能性是摇动叶子本身，给出计数`1`。 

对于内部顶点：

 1.我们可能会动摇`v`, 贡献数`1`。 
2.我们可以跳过`v`，在这种情况下，每个孩子都会选择一个有效的残数，并将残数以 3 为模进行相加。 

由于只有三个残基，因此每个状态最多包含三个值。 组合子项就变成了一个微小的模三卷积。 

蛮力方法跟踪顶点的精确子集。 关键的观察是，只有模三的计数才重要，并且每个子树仅通过该残差与树的其余部分交互。 这将指数搜索折叠成线性树 DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 树上的最优 DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 以顶点为树根`1`。 
2. 按后序处理顶点，以便每个子节点都在其父节点之前计算。 
3. 对于叶顶点，设置```
D[v] = {1}
```如果没有选择处于相同 DP 状态的祖先，则必须摇动叶子。 
4. 对于内部顶点，首先计算以下情况：`v`没有动摇。 

从残渣开始`{0}`。 
5. 对于每个子项，将当前残差集与子项的残差集组合起来。 

如果残留`a`已经可以实现并且剩余`b`在孩子身上是可以实现的，然后残留`(a + b) mod 3`处理该孩子后就可以实现。 
6. 处理所有子项后，结果集表示当`v`本身并没有动摇。 
7. 添加替代项，其中`v`动摇了。 

摇晃`v`仅贡献一次摇晃，因此残留`1`总是可以实现的。 
8. 商店```
D[v] = D_not_choose ∪ {1}
```9. 求根后，检查是否有余数`0`属于`D[1]`。 

如果是这样，则某些有效的覆盖使用可被三整除的震动次数，因此打印`"YES"`。 否则打印`"NO"`。 

### 为什么它有效

 对于每个子树，`D[v]`准确地包含了覆盖该子树内每个叶子的所有有效方法的残基，而不使用任何祖先`v`。 

该定义是完整的，因为子树的每个有效解决方案都属于以下两个类别之一：`v`被选择或未被选择。 

如果`v`选择时，整个子树都被一次摇动覆盖。 如果`v`不选择，每个子子树必须独立解决相同的问题，并且总摇动计数是子计数的总和。 

不遗漏有效解，不引入无效解。 通过子树大小的归纳，每个计算的残差都是可实现的，并且每个可实现的残差都被计算。 因此残留`0`根部等价于存在一个有效的全局解，其抖动次数是三的倍数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n = int(input())

        g = [[] for _ in range(n)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)

        parent = [-1] * n
        order = [0]
        parent[0] = 0

        for v in order:
            for to in g[v]:
                if parent[to] == -1:
                    parent[to] = v
                    order.append(to)

        dp = [0] * n

        for v in reversed(order):
            children = [to for to in g[v] if to != parent[v]]

            if not children:
                dp[v] = 1 << 1
                continue

            cur = 1 << 0

            for ch in children:
                nxt = 0
                child_mask = dp[ch]

                for r1 in range(3):
                    if not (cur & (1 << r1)):
                        continue

                    for r2 in range(3):
                        if child_mask & (1 << r2):
                            nxt |= 1 << ((r1 + r2) % 3)

                cur = nxt

            dp[v] = cur | (1 << 1)

        ans.append("YES" if (dp[0] & 1) else "NO")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```DFS 是迭代实现的，以避免 Python 对深树的递归限制。 

每个 DP 状态都存储为三位掩码。 少量`r`如果残留则设置`r`模三是可以实现的。 

例如：```
mask = 0b101
```表示残留物`0`和`2`是可能的。 

子组合步骤是模三卷积。 由于只有三个残数，因此每个孩子的工作量是恒定的。 

叶子案值得关注。 一片叶子没有孩子，但它的子树仍然包含一颗樱桃。 唯一有效的局部动作是摇动叶子，所以它的状态正是`{1}`。 

根本答案检查是否有残留`0`存在。 这对应于可被三整除的总震动次数。 

## 工作示例

 ### 示例 1

 输入：```
4
1 2
1 3
1 4
```根有三个子叶。 

| 顶点| 儿童残留物| 未选残| 最终残留物|
 | ---| ---| ---| ---|
 | 2 | - | - | {1} |
 | 3 | - | - | {1} |
 | 4 | - | - | {1} |
 | 1 | {1}、{1}、{1} | {0} | {0,1} |

 残留物`0`从根本上来说是可以实现的，所以答案是`YES`。 

这对应于摇动顶点`2`,`3`， 和`4`，仅使用三次摇动。 

### 示例 2

 输入：```
3
1 2
1 3
```| 顶点| 儿童残留物| 未选残| 最终残留物|
 | ---| ---| ---| ---|
 | 2 | - | - | {1} |
 | 3 | - | - | {1} |
 | 1 | {1}、{1} | {2} | {1,2} |

 残留物`0`没有出现。 

可能的摇晃次数为`1`和`2`，都不能被三整除，所以答案是`NO`。 

这个例子说明了为什么仅仅计算叶子是不够的。 根本身可能会被摇动，从而改变计数`2`到`1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每条边都被处理固定次数，并且每个 DP 合并仅使用 3×3 残差转换 |
 | 空间| O(n) | 邻接表、父数组、遍历顺序和 DP 掩码 |

 所有测试用例的顶点总数最多为`2·10^5`，因此线性解决方案很容易满足时间和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def solve():
        input = sys.stdin.readline
        t = int(input())
        out = []

        for _ in range(t):
            n = int(input())
            g = [[] for _ in range(n)]

            for _ in range(n - 1):
                u, v = map(int, input().split())
                u -= 1
                v -= 1
                g[u].append(v)
                g[v].append(u)

            parent = [-1] * n
            order = [0]
            parent[0] = 0

            for v in order:
                for to in g[v]:
                    if parent[to] == -1:
                        parent[to] = v
                        order.append(to)

            dp = [0] * n

            for v in reversed(order):
                children = [to for to in g[v] if to != parent[v]]

                if not children:
                    dp[v] = 1 << 1
                    continue

                cur = 1

                for ch in children:
                    nxt = 0
                    for a in range(3):
                        if cur & (1 << a):
                            for b in range(3):
                                if dp[ch] & (1 << b):
                                    nxt |= 1 << ((a + b) % 3)
                    cur = nxt

                dp[v] = cur | (1 << 1)

            out.append("YES" if dp[0] & 1 else "NO")

        return "\n".join(out)

    return solve()

# provided sample
assert run("""3
4
1 2
1 3
1 4
3
1 2
1 3
9
1 2
3 1
2 4
5 2
5 6
3 7
8 3
8 9
""") == """YES
NO
YES"""

# minimum tree
assert run("""1
2
1 2
""") == "NO"

# star with 3 leaves
assert run("""1
4
1 2
1 3
1 4
""") == "YES"

# chain of length 4, shaking root only
assert run("""1
4
1 2
2 3
3 4
""") == "NO"

# root with 6 leaf children
assert run("""1
7
1 2
1 3
1 4
1 5
1 6
1 7
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单边树 | 否 | 最小尺寸外壳 |
 | 根有3片叶子| 是 | 恰好可以摇晃三下 |
 | 长链| 否 | 仅存在一片叶子，计数为 |
