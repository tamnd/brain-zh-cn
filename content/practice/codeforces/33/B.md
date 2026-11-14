---
title: "CF 33B - 字符串问题"
description: "我们得到两个长度相同的小写字符串。 我们可以使用定向转换规则重复转换字符。 像 a -> b 这样成本为 5 的规则意味着我们可以通过支付 5 将 a 的出现一次更改为 b。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 33
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 33 (Codeforces format)"
rating: 1800
weight: 33
solve_time_s: 421
verified: true
draft: false
---
[CF 33B - 字符串问题](https://codeforces.com/problemset/problem/33/B)

 **评分：** 1800
 **标签：**最短路径
 **求解时间：** 7m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到两个长度相同的小写字符串。 我们可以使用定向转换规则重复转换字符。 像这样的规则`a -> b`有成本`5`意味着我们可以改变一次出现的情况`a`进入`b`通过支付`5`。 

目标不是将整个字符串直接转换为另一个字符串。 相反，对于每个位置，如果更便宜的话，我们可以将两个字符更改为第三个字符。 在所有转换之后，两个结果字符串必须变得相同，并且我们希望总成本最小。 

关键的观察是每个位置都是独立的。 如果在一个位置我们有字符`x`和`y`，我们只需要决定两者应该成为哪个最终角色。 总答案是所有位置的最优成本之和。 

字符串的长度可达`10^5`，这意味着任何每个位置的算法都必须非常小，最好是恒定的时间。 字母表仅包含小写英文字母，因此只有`26`可能的字符。 这完全改变了问题的形式。 尽管字符串很大，但转换图却很小。 

变换规则的数量最多为`500`。 直接转换可能不是最佳的，因为链接规则可能更便宜。 例如：```
a -> b : 10
a -> c : 2
c -> b : 2
```最便宜的方式是从`a`到`b`实际上是成本`4`。 

这会立即建议图表上的最短路径`26`节点。 

一些边缘情况很容易被错误处理。 

一种重要的情况是不存在共同的目标角色。 

例子：```
ab
cd
1
a c 5
```没有办法制作`b`和`d`等于任何东西，所以正确答案是：```
-1
```仅检查直接转换的粗心解决方案可能会错过某些位置的不可能性。 

另一种微妙的情况是将两个字符转换为第三个字符比将一个字符转换为另一个字符更便宜。 

例子：```
ab
bc
4
a d 1
b d 1
b c 100
```在第二个位置，转换`b`进入`c`成本`100`，但两者都可以成为`d`总成本`2`。 最佳结果字符串不一定是原始字符串之一。 

重复的规则是另一个陷阱。 

例子：```
a
b
2
a b 10
a b 3
```图必须保持最小边成本，否则我们会错误地使用`10`而不是`3`。 

最后，字符可能已经匹配。 即使图表中存在周期，这些位置也应贡献零成本。 

例子：```
aaa
aaa
1
a b 5
```答案仍然是零。 

## 方法

 暴力方法将单独处理每个位置并尝试所有可能的转换序列。 对于一对字符`(x, y)`，我们可以搜索所有路径`x`和`y`到所有其他角色。 由于转换可能任意链接，因此这很快就会成为图搜索问题。 

一种简单的实现方式是从头开始为每个位置和每个候选目标角色运行 Dijkstra 或 BFS。 带有长度的字符串`10^5`，即使是一个谦虚的`O(26^2)`每个位置的图计算变得不必要地昂贵。 

问题的结构提供了更强大的机会。 该图只有`26`顶点。 这意味着我们可以预先计算每对字符之间最便宜的成本一次，然后在恒定时间内回答每个字符串位置。 

变换规则形成有向加权图：```
character = node
transformation = directed edge
cost = edge weight
```如果我们知道每对字母之间的最短路径距离，那么对于一个位置`(s[i], t[i])`，我们只是尝试每一个可能的最终字符`c`。 

选择总成本`c`是：```
dist[s[i]][c] + dist[t[i]][c]
```我们选择所有的最小值`26`选择。 

因为图表很小，Floyd-Warshall 在这里是完美的。 其复杂度为`O(26^3)`，这实际上是常数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n × 26 × 图搜索) | O(26 + 边) | 太慢/不必要|
 | 最佳 | O(26^3 + 26 × n) | O(26^3 + 26 × n) | O(26^2) | O(26^2) | 已接受 |

 ## 算法演练

 1. 创建一个`26 × 26`距离矩阵初始化为无穷大。`dist[i][j]`将代表转变角色的最小成本`i`融入性格`j`。 
2. 设置`dist[i][i] = 0`对于每个角色。 

角色可以始终保持零成本不变。 
3.阅读每条转换规则`(a, b, w)`并更新：```
dist[a][b] = min(dist[a][b], w)
```同一对之间可能存在多个规则，因此我们只保留最便宜的直接边。 
4. 运行 Floyd-Warshall`26`字母。 

对于每个中间角色`k`，尝试改进每一对`(i, j)`使用：```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```这会计算最便宜的可能的链式转换。 
5. 如果两个字符串长度不同，则打印`-1`。 

每个操作仅更改字符，而不更改字符串长度。 
6.逐个位置处理字符串。 

假设当前字符是`x`和`y`。 
7.尝试每一个可能的最终角色`c`从`'a'`到`'z'`。 

计算：```
dist[x][c] + dist[y][c]
```以最小的总成本保持角色。 
8. 如果某个位置不存在有效字符，则打印`-1`。 

这意味着双方都无法访问任何角色。 
9. 否则，将所选字符附加到答案字符串并将其成本添加到总数中。 
10. 处理完所有位置后，打印总成本和结果字符串。 

### 为什么它有效

 Floyd-Warshall 保证在预处理后，`dist[a][b]`等于可能的最小转型成本`a`进入`b`使用任何规则序列。 

对于每个字符串位置，最终字符独立于所有其他位置。 任何有效的解决方案都必须选择一些目标角色`c`对于那个职位。 实现这一选择的最便宜的方法就是：```
dist[s[i]][c] + dist[t[i]][c]
```由于算法会检查所有`26`可能的目标字符并选择最小值，它会找到该位置的全局最优选择。 将所有位置上的这些独立最优成本相加即可得到最小总成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

def solve():
    s = input().strip()
    t = input().strip()

    if len(s) != len(t):
        print(-1)
        return

    n = int(input())

    dist = [[INF] * 26 for _ in range(26)]

    for i in range(26):
        dist[i][i] = 0

    for _ in range(n):
        a, b, w = input().split()
        w = int(w)

        u = ord(a) - ord('a')
        v = ord(b) - ord('a')

        dist[u][v] = min(dist[u][v], w)

    for k in range(26):
        for i in range(26):
            for j in range(26):
                if dist[i][k] == INF or dist[k][j] == INF:
                    continue

                nd = dist[i][k] + dist[k][j]

                if nd < dist[i][j]:
                    dist[i][j] = nd

    total_cost = 0
    result = []

    for cs, ct in zip(s, t):
        u = ord(cs) - ord('a')
        v = ord(ct) - ord('a')

        best_cost = INF
        best_char = ''

        for c in range(26):
            if dist[u][c] == INF or dist[v][c] == INF:
                continue

            cur = dist[u][c] + dist[v][c]

            if cur < best_cost:
                best_cost = cur
                best_char = chr(c + ord('a'))

        if best_cost == INF:
            print(-1)
            return

        total_cost += best_cost
        result.append(best_char)

    print(total_cost)
    print(''.join(result))

solve()
```第一部分构建图表。 矩阵从无穷大开始，因为大多数变换最初是不可能的。 将对角线设置为零至关重要，否则相同的字符将错误地需要转换。 

读取边缘时，代码使用`min()`因为输入可能包含重复的规则。 错过这个细节会默默地产生错误的最短路径。 

Floyd-Warshall 阶段很小，因为图大小固定为`26`。 检查针对`INF`避免无意义的加法，例如无穷大加数字。 

最后一个循环独立处理位置。 对于每一对字符，代码都会尝试所有`26`可能会遇到的角色，并选择最便宜的一个。 

一个微妙的实现细节是结果字符不需要等于任何一个原始字符。 该算法自然会处理这个问题，因为它会搜索整个字母表。 

另一个重要的细节是使用`10**18`为无穷大。 尽管实际成本很小，但使用非常大的整数可以防止在添加距离时出现溢出式逻辑错误。 

## 工作示例

 ### 示例 1

 输入：```
uayd
uxxd
3
a x 8
x y 13
d c 3
```经过 Floyd-Warshall 后，有用距离为：```
a -> x = 8
x -> y = 13
a -> y = 21
d -> c = 3
```现在处理位置。 

| 位置 | s[i] | t[i] | t[i] | 最佳目标| 成本|
 | --- | --- | --- | --- | --- |
 | 0 | 你| 你| 你| 0 |
 | 1 | 一个 | x| x| 8 |
 | 2 | y | x| y | 13 |
 | 3 | d | d | d | 0 |

 总成本变为`21`，结果字符串是：```
uxyd
```此示例说明了为什么最短路径很重要。 转换`a -> y`仅存在于`x`。 

### 示例 2

 输入：```
ab
bc
4
a d 1
b d 1
b c 100
c d 1
```工艺位置：

 | 位置 | s[i] | t[i] | t[i] | 候选目标| 总成本|
 | --- | --- | --- | --- | --- |
 | 0 | 一个 | 乙| d | 2 |
 | 1 | 乙| c | d | 2 |

 结果：```
4
dd
```第二个位置是有趣的。 直接转换`b -> c`成本`100`，但将两者都移至`d`仅成本`2`。 

这证实了最佳目标角色可能与两个原始角色完全不同。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(26^3 + 26 × n) | O(26^3 + 26 × n) | Floyd-Warshall 检测 26 个字母，然后对每个字符串位置进行 26 次检查 |
 | 空间| O(26^2) | O(26^2) | 距离矩阵|`26^3`只是`17576`操作，基本恒定。 主要工作是扫描字符串，其长度是线性的。 字符串可达`10^5`，这完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

INF = 10**18

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    s = input().strip()
    t = input().strip()

    if len(s) != len(t):
        return "-1"

    n = int(input())

    dist = [[INF] * 26 for _ in range(26)]

    for i in range(26):
        dist[i][i] = 0

    for _ in range(n):
        a, b, w = input().split()
        w = int(w)

        u = ord(a) - ord('a')
        v = ord(b) - ord('a')

        dist[u][v] = min(dist[u][v], w)

    for k in range(26):
        for i in range(26):
            for j in range(26):
                if dist[i][k] == INF or dist[k][j] == INF:
                    continue

                dist[i][j] = min(
                    dist[i][j],
                    dist[i][k] + dist[k][j]
                )

    total = 0
    ans = []

    for a, b in zip(s, t):
        u = ord(a) - ord('a')
        v = ord(b) - ord('a')

        best = INF
        ch = ''

        for c in range(26):
            if dist[u][c] == INF or dist[v][c] == INF:
                continue

            cur = dist[u][c] + dist[v][c]

            if cur < best:
                best = cur
                ch = chr(c + ord('a'))

        if best == INF:
            return "-1"

        total += best
        ans.append(ch)

    return f"{total}\n{''.join(ans)}"

# provided sample
assert run(
"""uayd
uxxd
3
a x 8
x y 13
d c 3
"""
) == "21\nuxyd", "sample 1"

# already equal
assert run(
"""aaa
aaa
1
a b 5
"""
) == "0\naaa", "equal strings"

# impossible transformation
assert run(
"""ab
cd
1
a c 5
"""
) == "-1", "impossible case"

# cheaper through intermediate
assert run(
"""a
c
2
a b 1
b c 1
"""
) == "2\nc", "shortest path chaining"

# duplicate edges
assert run(
"""a
b
2
a b 10
a b 3
"""
) == "3\nb", "minimum duplicate edge"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 相等的字符串 |`0`成本| 对角线初始化 |
 | 不可能的转换 |`-1`| 检测不可达状态 |
 | 间接更便宜的途径| 使用中间节点 | 弗洛伊德-沃歇尔正确性 |
 | 重复边缘| 使用最小边缘| 正确的图表构建 |

 ## 边缘情况

 考虑不可能的变换情况：```
ab
cd
1
a c 5
```该图仅包含一条边：```
a -> c
```在位置`0`， 人物`a`和`c`都可以成为`c`，因此该位置有效。 

在位置`1`， 人物`b`和`d`无法达到任何共同的性格。 期间`26`-字符扫描，每个候选人仍然无法联系到，所以`best_cost`保持无限。 该算法正确打印：```
-1
```现在考虑重复的边：```
a
b
2
a b 10
a b 3
```在读取输入时，算法存储：```
dist[a][b] = min(10, 3) = 3
```如果没有这一步，Floyd-Warshall 将从错误的直接边成本开始并产生错误的答案。 

最后，考虑第三个字符是最佳的情况：```
ab
bc
4
a d 1
b d 1
c d 1
b c 100
```在第二个位置：```
b -> c = 100
b -> d = 1
c -> d = 1
```该算法尝试所有目标字符并计算：```
target c : 100
target d : 2
```所以它正确选择了`d`。 仅将一个字符转换为另一个字符的贪婪方法在这里会失败。
