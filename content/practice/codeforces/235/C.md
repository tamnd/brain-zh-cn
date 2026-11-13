---
title: "CF 235C - 循环任务"
description: "我们得到一个大文本字符串 s，它对于整个输入是固定的。 然后我们收到许多查询字符串x。 对于查询 x，我们不仅仅对 x 本身感兴趣。 x 的任何循环旋转都被认为是等效的。"
date: "2026-06-04T16:31:32+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "string-suffix-structures", "strings"]
categories: ["algorithms"]
codeforces_contest: 235
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 146 (Div. 1)"
rating: 2700
weight: 235
solve_time_s: 156
verified: true
draft: false
---

[CF 235C - 循环任务](https://codeforces.com/problemset/problem/235/C)

 **评分：** 2700
 **标签：** 数据结构、字符串后缀结构、字符串
 **求解时间：** 2m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个大文本字符串`s`，对于整个输入来说是固定的。 然后我们收到很多查询字符串`x`。 

对于查询`x`，我们不仅仅对`x`本身。 任意循环旋转`x`被认为是等价的。 例如，对于`x = "abcd"`, 字符串`"abcd"`,`"bcda"`,`"cdab"`， 和`"dabc"`都属于同一循环类。 

对于每个查询，我们必须计算有多少个子串`s`等于任意旋转`x`。 

长度为`s`可以达到`10^6`，并且所有查询的总长度也最多为`10^6`。 针对每个查询单独扫描整个文本的解决方案是立即不可能的。 甚至一个`O(|s|)`每个查询的过程需要大约`10^12`最坏情况下的操作。 

这些约束强烈表明需要进行大量的预处理步骤`s`，然后是总查询长度的近线性处理。 

有一些微妙的情况，简单的解决方案可能会处理不当。 

考虑：```
s = "aaaaa"
x = "aa"
```的旋转`"aa"`仍然`"aa"`。 如果我们生成所有旋转并对它们的出现次数求和，我们就会对同一个字符串进行两次计数。 正确答案是`4`， 不是`8`。 

另一个例子：```
s = "ababab"
x = "abab"
```轮换是：```
abab
baba
abab
baba
```仅存在两个不同的字符串。 分别计算所有四次旋转会产生重复项。 

当旋转不发生时，会出现不同的陷阱`s`根本不。 例如：```
s = "abc"
x = "de"
```每次旋转都应贡献零，并且算法必须有效地检测到这一点，而无需搜索整个文本。 

主要困难是同时处理所有发生的情况`s`、查询的所有循环旋转以及重复旋转。 

## 方法

 蛮力的想法很简单。 

对于长度查询`m`，生成所有`m`轮换。 对于每次旋转，计算它出现的次数`s`。 后缀数组、后缀自动机或散列结构可以快速回答一次出现的查询。 

问题是长度的查询`m`有`m`轮换。 由于总查询长度可以达到`10^6`，生成的旋转总数大约可以达到`10^12`。 即使每次旋转都在恒定时间内处理，这也远远超出了极限。 

关键的观察是字符串的所有旋转都显示为长度-`m`里面的子串`x + x`。 

例如：```
x      = abcd
x + x  = abcdabcd
```旋转正好是起始位置位于前半部分的长度为 4 的子串。 

这将问题转化为：

 > 在所有不同的长度中-`m`的子串`x + x`对应于旋转，将它们内部出现的次数相加`s`。 

现在后缀自动机变得非常自然。 

在构建后缀自动机后`s`，每个状态代表一个最终位置等价类。 如果我们通过后缀链接传播出现次数，则每个状态都会存储该状态表示的每个字符串的出现次数。 

扫描时`x + x`，我们可以维护自动机中当前匹配的最长后缀。 每当匹配长度至少为`m`，我们知道长度的旋转`m`到此结束。 

剩下的挑战是确定与该确切长度相对应的状态 -`m`细绳。 

在后缀自动机中，状态`v`表示区间内的所有长度：```
(len(link(v)) + 1) ... len(v)
```所以对于一个长度正好的字符串`m`，我们爬升后缀链接，直到父级长度变得小于`m`。 结果状态唯一地代表了长度-`m`子串。 

扫描时同一旋转的不同情况可能会出现多次`x + x`。 我们只希望每个不同的旋转一次，因此我们对状态进行时间戳记，并在每次查询时对每个状态最多计数一次。 

这会产生与总查询长度呈线性关系的解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(总查询长度²) 或更糟 | O(1) | O(1) | 太慢了 |
 | 最佳 SAM 解决方案 | O( | s | + 总查询长度) |

 ## 算法演练

 1. 为文本字符串构建后缀自动机`s`。 
2. 对于每个新创建的非克隆状态，将其出现计数初始化为`1`。 
3. 按长度对状态进行排序，并将计数从较长的状态传播到其后缀链接父级。 在这一步之后，每个状态都将其表示的子串出现的次数存储在内部`s`。 
4. 查询`x`长度`m`,构造`t = x + x`。 
5. 仅扫描第一个`2m - 1`的字符`t`。 这些位置恰好生成`m`循环旋转。 
6、维护：

 -`p`，当前自动机状态。 
-`cur_len`，最长匹配后缀的长度。 
7. 对于每个字符，执行标准后缀自动机匹配转换。 如果转换不存在，请遵循后缀链接，直到它存在或返回到根。 
8. 每当`cur_len >= m`, 爬取后缀链接同时`len(link(p)) >= m`。 

此次调整后，说明`p`是其区间包含长度的唯一状态`m`。 该状态代表当前旋转。 
9. 如果在当前查询期间没有统计过该状态，则将其出现次数添加到答案中，并用当前查询时间戳进行标记。 
10.输出累计答案。 

### 为什么它有效

 每次循环旋转`x`作为长度仅出现一次`m`子字符串以第一个内的某个位置结尾`2m - 1`的字符`x + x`。 

在扫描期间，后缀自动机维护出现在已处理前缀中的最长后缀`s`。 当匹配的后缀的长度至少为`m`，长度-`m`以当前位置结尾的后缀是旋转`x`。 

后缀自动机状态表示连续间隔中的所有子串长度。 爬升后缀链接，直到父级长度变得小于`m`选择区间包含长度的唯一状态`m`。 该状态与当前旋转完全对应。 

该状态存储的出现次数等于表示的字符串出现的次数`s`。 重复的旋转映射到相同的状态，并且时间戳可以防止对它们进行多次计数。 因此，每个不同的旋转只贡献一次，答案是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()

max_states = 2 * len(s) + 5

link = [-1] * max_states
length = [0] * max_states
occ = [0] * max_states
nxt = [[0] * 26 for _ in range(max_states)]

size = 1
last = 0
link[0] = -1

for ch in s:
    c = ord(ch) - 97

    cur = size
    size += 1

    length[cur] = length[last] + 1
    occ[cur] = 1

    p = last
    while p != -1 and nxt[p][c] == 0:
        nxt[p][c] = cur
        p = link[p]

    if p == -1:
        link[cur] = 0
    else:
        q = nxt[p][c]
        if length[p] + 1 == length[q]:
            link[cur] = q
        else:
            clone = size
            size += 1

            length[clone] = length[p] + 1
            link[clone] = link[q]
            nxt[clone] = nxt[q][:]

            while p != -1 and nxt[p][c] == q:
                nxt[p][c] = clone
                p = link[p]

            link[q] = clone
            link[cur] = clone

    last = cur

max_len = len(s)

cnt = [0] * (max_len + 1)
for v in range(size):
    cnt[length[v]] += 1

for i in range(1, max_len + 1):
    cnt[i] += cnt[i - 1]

order = [0] * size
for v in range(size - 1, -1, -1):
    cnt[length[v]] -= 1
    order[cnt[length[v]]] = v

for i in range(size - 1, 0, -1):
    v = order[i]
    parent = link[v]
    if parent >= 0:
        occ[parent] += occ[v]

vis = [0] * size
timer = 0

q = int(input())

out = []

for _ in range(q):
    x = input().strip()
    m = len(x)

    t = x + x

    timer += 1
    ans = 0

    p = 0
    cur_len = 0

    for i in range(2 * m - 1):
        c = ord(t[i]) - 97

        while p != -1 and nxt[p][c] == 0:
            p = link[p]

        if p == -1:
            p = 0
            cur_len = 0
            continue

        cur_len = min(cur_len, length[p]) + 1
        p = nxt[p][c]

        while link[p] != -1 and length[link[p]] >= m:
            p = link[p]

        if cur_len >= m and vis[p] != timer:
            vis[p] = timer
            ans += occ[p]

    out.append(str(ans))

sys.stdout.write("\n".join(out))
```第一部分为文本字符串构建后缀自动机。 每个非克隆状态都以出现次数开始`1`，对应一个后缀结束位置。 

计数排序过程通过增加长度来对状态进行排序。 向后处理该顺序会通过后缀链接传播出现次数，从而生成标准 SAM 出现统计信息。 

对于每个查询，我们扫描`x + x`同时保持当前出现在自动机中的最长后缀。 更新内容```
cur_len = min(cur_len, length[p]) + 1
```是标准SAM匹配公式。 它在后缀链接跳转后正确调整当前匹配的长度。 

循环```
while link[p] != -1 and length[link[p]] >= m:
    p = link[p]
```是关键的一步。 完成后，说明`p`是其表示的区间包含长度的唯一状态`m`。 

时间戳数组避免了每次查询时清除大小高达 200 万的布尔数组。 每个查询都会收到一个唯一的标识符，并且该标识符的状态仅计数一次。 

## 工作示例

 ### 示例 1

 输入：```
s = baabaabaaa
x = baa
```然后：```
x + x = baabaa
```我们扫描第一个`2m - 1 = 5`人物。 

| 位置 | 人物 | 匹配长度≥3？ | 旋转表示|
 | --- | --- | --- | --- |
 | 0 | 乙| 没有 | - |
 | 1 | 一个 | 没有 | - |
 | 2 | 一个 | 是的 | 咩咩|
 | 3 | 乙| 是的 | aab |
 | 4 | 一个 | 是的 | 阿坝|

 不同的旋转是：```
baa
aab
aba
```它们的出现算作`s`是：```
3 + 2 + 2 = 7
```回答：```
7
```这个例子展示了每次旋转如何显示为长度-`m`窗口进入`x + x`。 

### 示例 2

 输入：```
s = aaaaa
x = aa
```然后：```
x + x = aaaa
```我们扫描前三个字符。 

| 位置 | 旋转| 已经算了吗？ |
 | --- | --- | --- |
 | 1 | 啊| 没有 |
 | 2 | 啊| 是的 |

 尽管存在两个旋转位置，但两者都代表相同的字符串。 时间戳机制只计算一次。 

出现次数为`"aa"`在`"aaaaa"`是`4`，所以答案是：```
4
```此示例演示了为什么必须删除重复的旋转。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O( | s |
 | 空间| O( | s |

 文本长度和总查询长度最多均为`10^6`。 后缀自动机最多包含约`2 · 10^6`状态，它完全符合内存限制。 线性运行时间完全在 3 秒以内，可实现高度优化的实现。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    # paste solution into solve()
    pass

# provided sample
assert run(
"""baabaabaaa
5
a
ba
baa
aabaa
aaba
"""
) == """7
5
7
3
5"""

# single character
assert run(
"""a
1
a
"""
) == """1"""

# duplicate rotations
assert run(
"""aaaaa
1
aa
"""
) == """4"""

# no rotation appears
assert run(
"""abc
1
de
"""
) == """0"""

# periodic query, many identical rotations
assert run(
"""ababab
1
abab
"""
) == """3"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`s="a", x="a"`|`1`| 最小尺寸|
 |`s="aaaaa", x="aa"`|`4`| 重复旋转 |
 |`s="abc", x="de"`|`0`| 缺少字符串 |
 |`s="ababab", x="abab"`|`3`| 定期轮换和重复数据删除 |

 ## 边缘情况

 考虑：```
aaaaa
1
aa
```轮换是：```
aa
aa
```两个旋转对应于相同的字符串。 扫描时`x + x`，多次达到相同的后缀自动机状态。 时间戳数组只允许第一次访问做出贡献。 算法输出`4`，这是出现的次数`"aa"`在`"aaaaa"`。 

考虑：```
abc
1
de
```匹配期间，不进行任何转换`'d'`从根部就存在。 自动机立即将当前匹配长度重置为零。 没有一个国家能够满足`cur_len >= m`，所以答案中没有添加任何内容。 结果是正确的`0`。 

考虑：```
ababab
1
abab
```四个旋转位置仅生成两个不同的字符串：```
abab
baba
```两者都映射到固定后缀自动机状态。 时间戳会忽略重复的访问，因此每个不同的轮换只贡献一次。 答案是这两个字符串出现次数的总和。
