---
title: "CF 49E - 共同祖先"
description: "每个 DNA 串都是通过重复应用 a -> bc 形式的规则而进化的。 一个字符恰好被两个字符替换，并且此操作可以重复任意次。 从某个祖先字符串开始，进化只会增加长度。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 49
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 46 (Div. 2)"
rating: 2300
weight: 49
solve_time_s: 121
verified: true
draft: false
---
[CF 49E - 共同祖先](https://codeforces.com/problemset/problem/49/E)

 **评分：** 2300
 **标签：** dp
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个 DNA 串都是通过重复应用以下形式的规则而进化的`a -> bc`。 一个字符恰好被两个字符替换，并且此操作可以重复任意次。 从某个祖先字符串开始，进化只会增加长度。 

我们得到了两条最终的 DNA 字符串，我们想知道它们是否都源自同一个祖先。 如果可以的话，我们必须找到这样一个祖先的最小可能长度。 

关键的观察是，进化独立地作用于祖先的每个特征。 如果祖先字符串是：```
x1 x2 x3 ...
```然后每个字符扩展成某个子字符串，所有扩展的串联产生最终的 DNA。 

输入字符串的长度最多为 50，产生式规则最多为 50 条。 这对于三次或四次动态规划来说足够小，但对于暴力生成所有可达字符串来说太大了。 即使单个字符也可以生成指数级的许多不同字符串，因为规则可能会递归分支：```
c -> cc
```已经创建了无限多个可到达的字符串。 

字母大小只有26个，这一点极其重要。 任何按字符索引的 DP 都很便宜。 

当根本不存在替代时，就会出现微妙的边缘情况。 

例子：```
ab
ab
0
```答案是`2`，因为祖先可以简单地是`"ab"`本身。 假设每个字符必须至少扩展一次的粗心解决方案将错误地拒绝这种情况。 

另一个棘手的情况是递归产生式。 

例子：```
a
aaaa
1
a->aa
```正确答案是`1`。 一个祖先字符可以重复扩展为整个目标字符串。 由于语法是循环的，因此对生成的字符串进行的朴素 BFS 可能永远不会终止。 

另一个重要的极端情况是当最佳祖先比一个字符长时，即使两个字符串都可以单独从单个符号派生。 

例子：```
ab
ba
2
x->ab
x->ba
```答案是`2`， 不是`1`。 没有一个符号可以同时生成两个字符串。 最短的共同祖先是`"ab"`本身。 

最后的微妙之处是对齐。 不同的祖先字符可以扩展成不同长度的子串。 

例子：```
abba
baab
2
x->ab
x->ba
```最佳分割不是逐个字符。 贪婪匹配方法会失败，因为同一分区必须同时适用于两个字符串。 

## 方法

 蛮力的想法很简单。 对于每个可能的祖先字符串，生成可从其访问的所有字符串，并检查两个目标字符串是否都出现。 

这在理论上是正确的，因为进化过程完全由替换规则定义。 问题是只要存在循环，可达状态空间就是无限的。 即使没有循环，生成的字符串数量也会随着扩展步骤的数量呈指数增长。 当目标长度达到 50 时，暴力破解几乎立即变得毫无希望。 

更好的视角来自于向后阅读规则。 

一条规则：```
a -> bc
```意味着每当我们看到从生成的相邻子串`b`和`c`，它们一起可能起源于`a`。 

这正是上下文无关的语法分析。 每个字符都是非终结符，并且每个规则将两个符号组合成一个父符号。 

假设我们定义：```
can[c][l][r]
```表示该字符`c`可以生成子字符串`s[l:r]`。 

然后我们可以用区间 DP 来计算，与 CYK 解析相同。 单个字符很容易生成自身，并且通过将它们分成两个较小的间隔并应用语法规则来构建更大的间隔。 

一旦我们知道，对于每个子串`s1`和`s2`，哪些字符可以生成它，原来的问题就变成了另一个DP。 

如果某个祖先角色`x`可以生成子字符串`s1[l1:r1]`还有子串`s2[l2:r2]`，那么一个祖先位置可以同时解释这两部分。 

现在定义：```
dp[i][j]
```作为生成前缀所需的最小祖先长度：```
s1[:i], s2[:j]
```我们尝试每对结束子串并检查是否存在公共生成字符。 如果是，我们将分解扩展一个祖先字符。 

这将问题从无限搜索转变为多项式动态规划。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数/无穷 | 指数| 太慢了 |
 | 最佳| O(26 × n3 + | s1 | ² × |

 这里`n`最多为 50。 

## 算法演练

 1.解析所有替换规则。 

对于每条规则`a -> bc`，存储该`a`可以结合结果`b`和`c`。 
2. 为第一个字符串建立区间 DP。 

定义：```
can1[ch][l][r]
```这是 true if 字符`ch`可以生成子字符串`s1[l:r]`。 

对于长度`1`，只有匹配的字符是可能的。 
3. 按长度递增的顺序扩展间隔。 

对于每个间隔`[l, r)`,尝试每个分割点`m`。 

如果有一些规则：```
a -> bc
```满足：```
can1[b][l][m] and can1[c][m][r]
```然后：```
can1[a][l][r] = True
```这是可行的，因为非平凡子串的每个派生树必须在根规则处分成两个子派生。 
4. 对第二根字符串重复相同的 DP。 

我们现在知道能够生成两个字符串中每个子字符串的每个字符。 
5. 定义主DP。 

让：```
dp[i][j]
```是生成所需的最小祖先长度：```
s1[:i] and s2[:j]
```初始化：```
dp[0][0] = 0
```6. 通过匹配一个祖先字符进行转换。 

对于之前的每个状态`(i, j)`，尝试所有子字符串结尾：```
s1[i:ni], s2[j:nj]
```如果存在一个字符`c`这样：```
can1[c][i][ni] and can2[c][j][nj]
```那么一个祖先符号可以生成两个子字符串，因此：```
dp[ni][nj] = min(dp[ni][nj], dp[i][j] + 1)
```7. 答案是`dp[len(s1)][len(s2)]`。 

如果无法访问，则打印`-1`。 

### 为什么它有效

 区间 DP 精确计算可从每个字符导出的子串集。 这是从语法结构中归纳出来的。 根据定义，长度为 1 的子串是正确的，并且每个较大的推导必须在根处应用一个产生式并分成两个较小的推导。 

第二个 DP 将两个字符串划分为相应的片段。 每个棋子对都是由相同的祖先角色生成的。 连接这些祖先字符形成有效的共同祖先字符串。 

每个有效祖先都会产生这样的分区，并且 DP 构造的每个分区都对应于一个有效祖先。 由于转换恰好添加了一个祖先字符，因此 DP 可以正确最小化祖先长度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

def build_can(s, rules):
    n = len(s)

    can = [[[-1] * (n + 1) for _ in range(n)] for _ in range(26)]

    for i, ch in enumerate(s):
        can[ord(ch) - ord('a')][i][i + 1] = 1

    for length in range(2, n + 1):
        for l in range(n - length + 1):
            r = l + length

            for m in range(l + 1, r):
                for a, b, c in rules:
                    if can[b][l][m] == 1 and can[c][m][r] == 1:
                        can[a][l][r] = 1

    return can

def solve():
    s1 = input().strip()
    s2 = input().strip()

    n = int(input())

    rules = []

    for _ in range(n):
        line = input().strip()

        a = ord(line[0]) - ord('a')
        b = ord(line[3]) - ord('a')
        c = ord(line[4]) - ord('a')

        rules.append((a, b, c))

    can1 = build_can(s1, rules)
    can2 = build_can(s2, rules)

    n1 = len(s1)
    n2 = len(s2)

    dp = [[INF] * (n2 + 1) for _ in range(n1 + 1)]
    dp[0][0] = 0

    for i in range(n1 + 1):
        for j in range(n2 + 1):
            if dp[i][j] == INF:
                continue

            for ni in range(i + 1, n1 + 1):
                for nj in range(j + 1, n2 + 1):

                    ok = False

                    for ch in range(26):
                        if can1[ch][i][ni] == 1 and can2[ch][j][nj] == 1:
                            ok = True
                            break

                    if ok:
                        dp[ni][nj] = min(dp[ni][nj], dp[i][j] + 1)

    ans = dp[n1][n2]

    print(-1 if ans == INF else ans)

solve()
```这`build_can`函数执行语法分析 DP。 每个状态存储一个字符是否可以导出子串。 间隔按长度递增的顺序进行处理，因为较大的导数取决于较小的间隔。 

代表：```
can[ch][l][r]
```有点不寻常，因为右端点是排他的。 这避免了许多相差一的错误。 子字符串始终是：```
s[l:r]
```与 Python 切片完全相同。 

主 DP 将字符串视为被划分为同步块。 每个转换都会检查一个字符是否可以派生出两个选定的子字符串。 

嵌套循环可能看起来很昂贵，但限制很小。 最多：```
51 × 51 × 51 × 51 × 26
```检查发生，这很容易及时进行。 

一个微妙的实现细节是我们从不要求派生树具有相同的形状。 我们只要求某个公共字符可以独立生成两个子串。 区间 DP 已经封装了所有可能的推导。 

## 工作示例

 ### 示例 1

 输入：```
ababa
aba
2
c->ba
c->cc
```唯一有用的生产是：```
c -> ba
```第二条规则允许重复扩展。 

区间 DP 发现：

 | 字符串| 子串| 生成角色 |
 | --- | --- | --- |
 | 阿巴巴| 巴| c |
 | 阿坝| 巴| c |

 现在主要DP继续进行。 

| 状态| 选定的子串 | 常见字符 | 新成本|
 | --- | --- | --- | --- |
 | (0,0) | (0,0) | 一个/一个| 一个 | 1 |
 | (1,1) | 巴/巴| c | 2 |
 | (3,3) | 巴/空| 不可能| - |

 最优分解为：```
a + c
```其长度为`2`。 

此示例演示了递归生成。 人物`c`不会直接出现在任一最终字符串中，但重复的反向解析仍然可以检测到它。 

### 示例 2

 输入：```
aaaa
aa
1
a->aa
```区间解析发现：

 | 子串| 可以通过 | 生成
 | --- | --- |
 | 一个 | 一个 |
 | 啊| 一个 |
 | 啊啊| 一个 |

 递归规则让我们`a`任意扩展多次。 

主 DP 变为：

 | 状态| 精选作品| 常见字符 | 成本|
 | --- | --- | --- | --- |
 | (0,0) | (0,0) | 啊啊/啊| 一个 | 1 |

 所以答案是`1`。 

这证实了推导深度并不重要。 单个祖先字符可能会生成非常不同的子字符串长度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(26 × n3 + n⁴ × 26) | 区间解析加成对子串DP |
 | 空间| O(26 × n²) | O(26 × n²) | 子字符串的可达性表 |

 和`n ≤ 50`，最坏情况下的操作次数明显低于限制。 由于字母大小固定为 26，因此内存使用量也很小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

INF = 10**9

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def build_can(s, rules):
        n = len(s)

        can = [[[-1] * (n + 1) for _ in range(n)] for _ in range(26)]

        for i, ch in enumerate(s):
            can[ord(ch) - ord('a')][i][i + 1] = 1

        for length in range(2, n + 1):
            for l in range(n - length + 1):
                r = l + length

                for m in range(l + 1, r):
                    for a, b, c in rules:
                        if can[b][l][m] == 1 and can[c][m][r] == 1:
                            can[a][l][r] = 1

        return can

    s1 = input().strip()
    s2 = input().strip()

    n = int(input())

    rules = []

    for _ in range(n):
        line = input().strip()

        a = ord(line[0]) - ord('a')
        b = ord(line[3]) - ord('a')
        c = ord(line[4]) - ord('a')

        rules.append((a, b, c))

    can1 = build_can(s1, rules)
    can2 = build_can(s2, rules)

    n1 = len(s1)
    n2 = len(s2)

    dp = [[INF] * (n2 + 1) for _ in range(n1 + 1)]
    dp[0][0] = 0

    for i in range(n1 + 1):
        for j in range(n2 + 1):
            if dp[i][j] == INF:
                continue

            for ni in range(i + 1, n1 + 1):
                for nj in range(j + 1, n2 + 1):

                    ok = False

                    for ch in range(26):
                        if can1[ch][i][ni] == 1 and can2[ch][j][nj] == 1:
                            ok = True
                            break

                    if ok:
                        dp[ni][nj] = min(dp[ni][nj], dp[i][j] + 1)

    ans = dp[n1][n2]

    return str(-1 if ans == INF else ans)

# provided sample
assert run(
"""ababa
aba
2
c->ba
c->cc
"""
) == "2"

# identical strings, no rules
assert run(
"""abc
abc
0
"""
) == "3"

# recursive expansion
assert run(
"""aaaa
aa
1
a->aa
"""
) == "1"

# impossible case
assert run(
"""ab
cd
0
"""
) == "-1"

# single-character ancestor expands differently
assert run(
"""aaaa
aaaaaaaa
1
a->aa
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 没有规则的相同字符串 | 3 | 没有替换的基本情况 |
 | 递归的`a->aa`| 1 | 无限推导链|
 | 完全不同的字符串| -1 | 不可能的重建|
 | 大递归扩展| 1 | 来自同一祖先的不同输出长度 |

 ## 边缘情况

 考虑没有替换的情况。 

输入：```
ab
ab
0
```区间DP仅标记单字符子串。 一个符号不能生成更大的子串。 

主 DP 将两个字符串划分为：```
a + b
```所以答案就变成了`2`。 

这正确地模拟了允许未更改的字符。 进化可以执行零操作。 

现在考虑递归增长。 

输入：```
aaaa
aa
1
a->aa
```区间DP首先标记所有单`a`子串。 然后长度为 2 的子串可以从`a`。 再次组合这些使得可以派生出长度为 4 的子串`a`。 

该算法从不显式模拟扩展深度。 它只跟踪子串的可导性，因此循环是无害的。 

最后，考虑不兼容的推导。 

输入：```
ab
ba
2
x->ab
x->ba
```区间 DP 发现：```
x generates ab
x generates ba
```但不存在单个子字符串对同时使用同一字符覆盖整个字符串。 

主 DP 则分解为：```
a + b
```给出答案`2`。 

这说明了为什么同步分区是必要的。 独立匹配两个字符串的可导性是不够的。
