---
title: "CF 106157J - 比武排序"
description: "我们给出了一组小写字母之间的排序规则。 诸如 a < b 之类的规则意味着在最终重新排列的单词中，a 的每次出现都必须出现在 b 的每次出现之前。 规则 a b 与 b < a 含义相同。 输入还包含一个单词。"
date: "2026-06-25T11:19:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106157
codeforces_index: "J"
codeforces_contest_name: "2025 United Kingdom and Ireland Programming Contest (UKIEPC 2025)"
rating: 0
weight: 106157
solve_time_s: 37
verified: true
draft: false
---

[CF 106157J - 格斗排序](https://codeforces.com/problemset/problem/106157/J)

 **评级：** -
 **标签：** -
 **求解时间：** 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一组小写字母之间的排序规则。 一个规则，例如`a < b`意味着每次出现`a`必须出现在每次出现之前`b`在最后重新排列的单词中。 一条规则`a > b`意思是一样的`b < a`。 

输入还包含一个单词。 我们可以随心所欲地重新排列它的字母，但最终的排列必须同时满足每个排序规则。 

任务是输出单词的任何有效重新排列。 如果规则相互矛盾，无法同时满足所有规则，我们必须打印`IMPOSSIBLE`。 

一个有用的观察是只有 26 个可能的字母。 尽管规则数量可以多达700条，字长可以达到100,000，但实际的依赖图仅建立在26个顶点上。 

大字长告诉我们，重复比较或移动单个字符是浪费的。 相反，这些约束建议将问题分为两部分。 首先，确定有效的全局字母顺序。 其次，利用每个字母的出现频率来有效地构建答案。 

错误的常见来源是处理间接矛盾。 

考虑：```
3
a < b
b < c
c < a
abc
```规则形成一个循环。 无法安排`a`前`b`,`b`前`c`， 和`c`前`a`同时。 正确的输出是：```
IMPOSSIBLE
```另一个微妙的情况是两个字母没有关系。```
1
b < n
banana
```规则仅约束`b`和`n`。 这封信`a`与两者无关。 任何安排都`b`人物优先`n`字符有效。 存在多种答案。 

当单词不包含某些受限字母时，会出现第三种边缘情况。```
2
x < y
y < z
banana
```约束仍然参与循环检测，但丢失的字母对输出贡献零副本。 仍然需要有效的拓扑顺序。 

## 方法

 暴力方法会尝试单词中出现的字母的不同排列，并检查是否满足每个规则。 这立即是不可行的。 即使只出现 10 个不同的字母，也有`10! = 3,628,800`可能的订单。 

该问题的结构比一般的重排问题更具限制性。 每条规则仅描述字母类型之间的相对顺序。 各个副本的确切位置并不重要。 

这建议将每个字母表示为有向图中的一个顶点。 对于一个规则`a < b`，我们添加一条边`a → b`。 任何有效的最终安排都必须放置信件`a`信前`b`，因此每个有效解都对应于该图的拓扑排序。 

如果图包含环，则不存在拓扑顺序，答案是不可能的。 

如果图是非循环的，则拓扑顺序给出所有 26 个字母的有效全局排序。 一旦知道了这个顺序，构造这个词就很容易了。 计算每个字母在原始单词中出现的次数，然后按照拓扑顺序输出每个字母的所有副本。 

该图很小，只有 26 个顶点，因此拓扑排序本质上是常数时间。 主要工作是计算字符并写入输出字符串。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k!) | O(k) | 太慢了 |
 | 最佳 | O(n + \|s\|) | O(n + 26) | 已接受 |

 这里`n`是排序规则的数量，`|s|`是字长。 

## 算法演练

 1. 创建一个有 26 个顶点的有向图，每个小写字母一个。 
2. 对于每条规则：

 - 如果规则是`a < b`, 添加边缘`a → b`。 
- 如果规则是`a > b`, 添加边缘`b → a`。 

这对所需的优先关系进行编码。 
3. 计算每个顶点的入度。 
4. 运行卡恩拓扑排序。 

- 从入度为零的每个顶点开始。 
- 重复删除这样的顶点并将其附加到拓扑顺序中。 
- 减少其传出邻居的入度。 
- 每当邻居达到零度时，将其添加到队列中。 
5. 如果处理的顶点少于 26 个，则该图包含环。 输出`IMPOSSIBLE`。 
6. 计算给定单词中每个字母的出现频率。 
7. 遍历计算出的拓扑顺序。 对于每个字母，附加该字母的次数与它在单词中出现的次数完全相同。 
8. 输出结果字符串。 

### 为什么它有效

 图中的每条边都代表强制排序约束。 卡恩的算法产生一个排序，其中每个有向边从较早的字母到较晚的字母。 

当我们根据这种拓扑顺序输出字母的所有副本时，对于每条边，源字母的每次出现都出现在目标字母的每次出现之前。 由于拓扑顺序满足所有边，因此它也满足每个排序规则。 

如果存在循环，则某些字母集必须各自出现在同一循环中的另一个字母之前。 没有线性排列可以满足该要求，所以`IMPOSSIBLE`是正确的答案。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

n = int(input())

adj = [[] for _ in range(26)]
indeg = [0] * 26
seen = set()

for _ in range(n):
    a, op, b = input().split()

    if op == "<":
        u = ord(a) - ord('a')
        v = ord(b) - ord('a')
    else:
        u = ord(b) - ord('a')
        v = ord(a) - ord('a')

    if (u, v) not in seen:
        seen.add((u, v))
        adj[u].append(v)
        indeg[v] += 1

s = input().strip()

q = deque(i for i in range(26) if indeg[i] == 0)

topo = []

while q:
    u = q.popleft()
    topo.append(u)

    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)

if len(topo) != 26:
    print("IMPOSSIBLE")
    sys.exit()

cnt = [0] * 26
for ch in s:
    cnt[ord(ch) - ord('a')] += 1

ans = []

for x in topo:
    ans.append(chr(x + ord('a')) * cnt[x])

print("".join(ans))
```图构造将每个比较转换为方向与所需顺序匹配的有向边。 

这`seen`set 可防止重复边人为地增加入度。 即使输入保证不同的规则，这也会使实现变得健壮。 

只要存在拓扑排序，卡恩算法就会产生有效的拓扑排序。 循环检查是通过验证是否已处理所有 26 个字母来执行的。 

最后的构建步骤使用频率而不是对整个字符串进行排序。 这很重要，因为该单词最多可以包含 100,000 个字符。 追加`count(letter)`每个字符的副本直接与字长成线性关系。 

## 工作示例

 ### 示例 1

 输入：```
3
m > i
n < i
i > o
minion
```规则变为：

 -`i < m`-`n < i`-`o < i`相关频率：

 | 信| 计数 |
 | ---| ---|
 | 我| 2 |
 | 米 | 1 |
 | n | 2 |
 | 哦| 1 |

 一种有效的拓扑顺序始于：

 | 步骤| 选择的字母 | 部分订单 |
 | ---| ---| ---|
 | 1 | n | n |
 | 2 | 哦| 没有|
 | 3 | 我| 不我|
 | 4 | 米 | 不，我是 |

 从频率构建单词给出：```
noniim
```这满足`n < i`,`o < i`， 和`i < m`。 

### 示例 2

 输入：```
1
b < n
banana
```频率：

 | 信| 计数 |
 | ---| ---|
 | 一个 | 3 |
 | 乙| 1 |
 | n | 2 |

 一种有效的拓扑顺序可以放置：

 | 步骤| 信|
 | ---| ---|
 | 1 | 一个 |
 | 2 | 乙|
 | 3 | n |

 结果：```
aaabnn
```唯一需要的条件是所有`b`人物优先`n`人物，很满意。 

此示例表明，不相关的字母可能出现在彼此相关的任何位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + \|s\|) | 根据规则构建图表并计算并输出单词 |
 | 空间| O(n + 26) | 图形边缘和频率数组 |

 由于该图仅包含 26 个顶点，因此拓扑排序实际上是常数时间。 运行时间主要是处理输入规则和单词的字符，这很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())

    adj = [[] for _ in range(26)]
    indeg = [0] * 26
    seen = set()

    for _ in range(n):
        a, op, b = input().split()

        if op == "<":
            u = ord(a) - 97
            v = ord(b) - 97
        else:
            u = ord(b) - 97
            v = ord(a) - 97

        if (u, v) not in seen:
            seen.add((u, v))
            adj[u].append(v)
            indeg[v] += 1

    s = input().strip()

    q = deque(i for i in range(26) if indeg[i] == 0)
    topo = []

    while q:
        u = q.popleft()
        topo.append(u)

        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)

    if len(topo) != 26:
        return "IMPOSSIBLE\n"

    cnt = [0] * 26
    for ch in s:
        cnt[ord(ch) - 97] += 1

    ans = []
    for x in topo:
        ans.append(chr(x + 97) * cnt[x])

    return "".join(ans) + "\n"

# custom cases

out = run("""0
a
""")
assert sorted(out.strip()) == ['a']

assert run("""3
a < b
b < c
c < a
abc
""") == "IMPOSSIBLE\n"

out = run("""1
b < n
banana
""")
assert out.strip().count('a') == 3
assert out.strip().index('b') < out.strip().rindex('n')

out = run("""2
x < y
y < z
banana
""")
assert sorted(out.strip()) == sorted("banana")

out = run("""1
a > b
abba
""")
s = out.strip()
assert s.rfind('b') < s.find('a')
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单字母词 | 任何有效的单字母答案 | 最小尺寸|
 | 循环`a<b<b<c<c<a`|`IMPOSSIBLE`| 循环检测|
 |`b<n`和`banana`| 任何有效的安排 | 部分订单处理 |
 | 对缺席信件的限制 | 有效的重新排列 | word 中缺少字母 |
 |`a>b`和`abba`| 全部`b`首先`a`| 正确的边缘方向 |

 ## 边缘情况

 考虑循环输入：```
3
a < b
b < c
c < a
abc
```该图包含边`a → b`,`b → c`， 和`c → a`。 每个顶点都有正入度。 卡恩算法无法处理全部 26 个字母，因此拓扑顺序不完整。 该算法输出：```
IMPOSSIBLE
```这是正确的，因为不存在有效的排序。 

考虑具有不相关字母的输入：```
1
b < n
banana
```该图仅包含一条边。 拓扑排序可以放置`a`任何相对于`b`和`n`。 生成的字符串可以是`aaabnn`,`baaann`，或许多其他。 每个有效答案都会保留所有`b`所有字符之前`n`人物。 

考虑涉及缺失字母的约束：```
2
x < y
y < z
banana
```拓扑顺序仍包括`x`,`y`， 和`z`，但它们的频率为零。 在构建过程中，这些字母会附加零个副本。 该算法输出重新排列`banana`并正确尊重所有约束，即使这些字母从未出现在单词中。
