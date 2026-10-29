---
title: "CF 150B - 琴弦数量"
description: "我们想要计算由大小为 m 的字母表构建的长度为 n 的字符串，但有一个严格的限制：每个长度为 k 的子字符串必须是回文。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dfs-and-similar", "graphs", "math"]
categories: ["algorithms"]
codeforces_contest: 150
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 107 (Div. 1)"
rating: 1600
weight: 150
solve_time_s: 100
verified: true
draft: false
---

[CF 150B - 字符串数量](https://codeforces.com/problemset/problem/150/B)

 **评分：** 1600
 **标签：** 组合学、dfs 和类似、图形、数学
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们想要计算字符串的长度`n`由大小的字母表构建`m`，在一个严格的限制下：每个长度的子串`k`必须是回文。 

长度的子串`k`从位置开始`i`包含字符$$s_i, s_{i+1}, \dots, s_{i+k-1}$$回文意味着$$s_i = s_{i+k-1}, \quad s_{i+1} = s_{i+k-2}, \dots$$任务是计算有多少完整字符串同时满足所有这些约束。 由于数字可能变得巨大，我们输出答案模$10^9 + 7$。 

这些限制足够小，足以允许对头寸进行图形构建或 DFS。 和`n, k ≤ 2000`， 一个$O(n^2)$算法是完全安全的。 立方解决方案将开始变得有风险，尤其是在 Python 中。 枚举所有字符串是不可能的，因为有$m^n$候选人，甚至`n = 50`这个数字已经是天文数字了。 

棘手的部分是重叠子串的回文条件彼此相互作用。 当地的条件可能会迫使不平等相去甚远。 

考虑这个例子：```
n = 5, k = 3
```子串是：```
s[0..2], s[1..3], s[2..4]
```从第一个回文我们得到：```
s0 = s2
```从第二个开始：```
s1 = s3
```从第三个开始：```
s2 = s4
```将它们结合起来可以得到：```
s0 = s2 = s4
s1 = s3
```所以整个字符串仅由两个独立的字符组决定。 

一个常见的错误是独立对待每个子串并增加可能性。 这会超出计数，因为相同的位置出现在许多子字符串中。 

另一个微妙的边缘情况是`k = 1`。 每个子串的长度`1`自动是回文，因此根本不存在等式约束。 

例子：```
n = 4, m = 3, k = 1
```每个字符串都有效，所以答案是：```
3^4 = 81
```总是合并窗口内位置的粗心实现可能会意外添加约束，即使不存在约束也是如此。 

相反的极端是`k = n`。 那么整个字符串本身一定是回文。 

例子：```
n = 5, m = 2, k = 5
```我们需要：```
s0 = s4
s1 = s3
```只有三个位置是独立的，所以答案是：```
2^3 = 8
```理解问题实际上是关于指数之间的平等关系是关键的观察。 

## 方法

 蛮力方法很简单。 生成每个长度的字符串`n`，然后检查是否每个长度的子串`k`是一个回文。 

有$m^n$字符串。 对于每个字符串，我们粗略地检查`n`子串，每个回文检查的成本高达`k`。 

这给出：$$O(m^n \cdot n \cdot k)$$即使对于中等值来说，这也是没有希望的。 

暴力破解在概念上起作用的原因是条件很容易在本地验证。 问题在于候选字符串的数量呈指数级爆炸。 

重要的观察是回文约束仅迫使某些位置相等。 他们从不限制使用哪个实际字符。 

假设一个子串的长度`k`开始于`i`。 然后对于每个偏移量`j`：$$s_{i+j} = s_{i+k-1-j}$$因此，地位通过平等关系联系起来。 

一旦知道两个位置相等，它们就表现为单个变量。 处理完所有子字符串后，字符串被划分为位置相等的连通分量。 

如果有`c`独立的组件，那么每个组件可以选择其中的任何一个`m`独立字母。 

所以答案就变成了：$$m^c$$模数$10^9+7$。 

这将问题从构建字符串转变为计算图中的连接组件。 

我们可以对职位进行建模`0 ... n-1`作为图的顶点。 每当回文条件要求两个位置必须匹配时，我们就会将它们连接起来。 然后我们计算剩余的连接组件数量。 

DFS、BFS 或 DSU 都可以工作。 由于约束很小，一个简单的 DFS 解决方案就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(m^n \cdot n \cdot k)$|$O(n)$| 太慢了|
 | 最佳 |$O(nk)$|$O(n^2)$| 已接受 |

 ## 算法演练

 1. 创建一个图表`n`顶点，每个字符串位置一个。 
2. 对于每个长度的子串`k`，添加回文条件隐含的相等边。 

如果子字符串开始于`i`， 然后：$$s_{i+j} = s_{i+k-1-j}$$对于所有有效的`j`。 

所以我们在图中连接这两个索引。 
3. 处理完所有子串后，任意路径连接的位置必须包含相同的字符。 

这是有效的，因为平等是传递的。 如果`a = b`和`b = c`， 然后`a = c`。 
4. 对图运行 DFS 以计算连接的组件。 

每个连接的组件对应一个独立的字符选择。 
5. 计算：$$m^{\text{components}} \bmod (10^9+7)$$使用快速模幂。 

### 为什么它有效

 每个回文约束都可以写成位置对之间的等式集合。 该图准确地存储了这些等式。 

如果两个位置属于同一个连通分量，则存在连接它们的相等关系链，因此它们必须包含相同的字符。 

如果两个位置位于不同的组件中，则没有约束将它们链接起来，因此可以独立选择它们。 

因此，每个连接的组件的行为就像一个自由变量`m`选择。 乘以所有分量得出：$$m^c$$在哪里`c`是连接分量的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def main():
    n, m, k = map(int, input().split())

    graph = [[] for _ in range(n)]

    # Add palindrome equality constraints
    for start in range(n - k + 1):
        l = start
        r = start + k - 1

        while l < r:
            graph[l].append(r)
            graph[r].append(l)
            l += 1
            r -= 1

    visited = [False] * n

    def dfs(node):
        stack = [node]
        visited[node] = True

        while stack:
            u = stack.pop()

            for v in graph[u]:
                if not visited[v]:
                    visited[v] = True
                    stack.append(v)

    components = 0

    for i in range(n):
        if not visited[i]:
            components += 1
            dfs(i)

    print(pow(m, components, MOD))

if __name__ == "__main__":
    main()
```该图存储位置之间的相等约束。 对于每个长度的子串`k`，我们连接镜像索引，因为这些位置必须在回文中匹配。 

循环：```
while l < r:
```很重要。 我们只连接镜像对一次。 什么时候`k`很奇怪，中间的字符不会产生任何约束，因为它反映了自身。 

DFS 计算连通分量。 每个未访问的节点都会启动一个新组件，该组件代表一个独立的字符组。 

使用迭代 DFS 可以避免递归深度问题，尽管递归也符合这些限制。 

最终答案使用Python内置的模幂运算：```
pow(m, components, MOD)
```以对数时间运行。 

一个微妙的实现细节是索引。 问题陈述自然是从 1 开始的，但代码自始至终都使用从 0 开始的索引。 子串`[start, start + k - 1]`必须小心处理，避免出现差一的错误。 

## 工作示例

 ### 示例 1

 输入：```
1 1 1
```只有一个位置和一个可能的字符。 

| 步骤| 行动| 图| 组件|
 | --- | --- | --- | --- |
 | 1 | 创建节点 0 | 无边| 0 |
 | 2 | 不需要回文对 | 无边| 0 |
 | 3 | 来自节点 0 的 DFS | 一个组件 | 1 |
 | 4 | 计算$1^1$| 最终答案| 1 |

 跟踪显示`k = 1`边缘情况。 不添加等式约束，因此每个位置保持独立。 

### 示例 2

 输入：```
5 2 3
```长度为 3 的子串：```
[0,1,2]
[1,2,3]
[2,3,4]
```回文约束：```
0 = 2
1 = 3
2 = 4
```| 步骤| 添加边缘 | 连接组 |
 | --- | --- | --- |
 | 1 | (0, 2) | (0, 2) | {0,2} |
 | 2 | (1, 3) | {1,3} |
 | 3 | (2, 4) | {0,2,4}, {1,3} |

 现在正好有两个连接的组件。 

所以答案是：$$2^2 = 4$$有效的字符串是：```
ababa
babab
aaaaa
bbbbb
```此示例演示了重叠子串如何长距离传播相等性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(nk)$| 每个子串最多贡献`k/2`等边 |
 | 空间|$O(n^2)$| 该图可以包含$O(nk)$最坏情况下的边缘|

 和`n ≤ 2000`，图表仍然很小。 即使在最密集的情况下，总工作量也只有几百万次操作，完全在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 10**9 + 7

def solve():
    input = sys.stdin.readline

    n, m, k = map(int, input().split())

    graph = [[] for _ in range(n)]

    for start in range(n - k + 1):
        l = start
        r = start + k - 1

        while l < r:
            graph[l].append(r)
            graph[r].append(l)
            l += 1
            r -= 1

    visited = [False] * n

    def dfs(node):
        stack = [node]
        visited[node] = True

        while stack:
            u = stack.pop()

            for v in graph[u]:
                if not visited[v]:
                    visited[v] = True
                    stack.append(v)

    components = 0

    for i in range(n):
        if not visited[i]:
            components += 1
            dfs(i)

    print(pow(m, components, MOD))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup

    return out.getvalue().strip()

# provided sample
assert run("1 1 1\n") == "1", "sample 1"

# k = 1, every string valid
assert run("4 3 1\n") == "81", "all strings allowed"

# full string must be palindrome
assert run("5 2 5\n") == "8", "entire string palindrome"

# overlapping constraints create one component
assert run("4 10 2\n") == "10", "adjacent equality chain"

# odd palindrome propagation
assert run("5 2 3\n") == "4", "two independent groups"

# maximum-style stress shape
assert run("2000 1 2000\n") == "1", "single alphabet letter"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`4 3 1`|`81`| 没有限制时`k = 1`|
 |`5 2 5`|`8`| 整个字符串回文行为 |
 |`4 10 2`|`10`| 相邻等式合并所有内容 |
 |`5 2 3`|`4`| 重叠窗口传播约束 |
 |`2000 1 2000`|`1`| 大边界值|

 ## 边缘情况

 考虑：```
4 3 1
```每个子串的长度`1`自动是回文。 该图根本没有边。 

DFS 有四个独立的组件：```
{0}, {1}, {2}, {3}
```所以答案是：$$3^4 = 81$$这证实了算法在以下情况下不会意外引入约束：`k = 1`。 

现在考虑：```
5 2 5
```整个字符串必须是回文。 

该算法添加：```
0 = 4
1 = 3
```位置`2`独自一人。 

连接的组件变为：```
{0,4}, {1,3}, {2}
```所以存在三个独立的选择：$$2^3 = 8$$这验证了当回文跨越整个字符串时处理是否正确。 

最后，考虑等式传递传递的情况：```
4 10 2
```每个子串的长度`2`必须是回文，意味着相邻字符必须匹配。 

图的边是：```
0-1
1-2
2-3
```DFS 将所有内容合并到一个组件中：```
{0,1,2,3}
```只剩下一个角色选择，所以答案是：$$10^1 = 10$$这证实了连接的组件正确地捕获了传递相等性。
