---
title: "CF 120H - 简洁是智慧的灵魂"
description: "我们最多可以得到 200 个不同的小写单词。 对于每个单词，我们必须选择一个简短的缩写，其长度在1到4个字符之间，并且其字符在原词中出现的顺序相同。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "graph-matchings"]
categories: ["algorithms"]
codeforces_contest: 120
codeforces_index: "H"
codeforces_contest_name: "School Regional Team Contest, Saratov, 2011"
rating: 1800
weight: 120
solve_time_s: 153
verified: false
draft: false
---

[CF 120H - 简洁是智慧的灵魂](https://codeforces.com/problemset/problem/120/H)

 **评分：** 1800
 **标签：**图形匹配
 **求解时间：** 2m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们最多可以得到 200 个不同的小写单词。 对于每个单词，我们必须选择一个简短的缩写，其长度在1到4个字符之间，并且其字符在原词中出现的顺序相同。 字符不需要相邻，因此每个缩写只是单词的子序列。 

关键的限制是唯一性。 两个不同的单词不能使用相同的缩写。 如果存在这样的分配，我们必须为每个单词打印一个有效的缩写。 否则我们打印`-1`。 

小字长完全改变了问题的性质。 每个单词的长度最多为 10，而缩写的长度最多为 4。这意味着每个单词可能的子序列总数足够小，可以直接枚举。 

对于长度为 10 的字，长度为 1 到 4 的子序列的数量为：$$\binom{10}{1} + \binom{10}{2} + \binom{10}{3} + \binom{10}{4}$$

$\binom{10}{1}+\binom{10}{2}+\binom{10}{3}+\binom{10}{4}$这等于 385。即使在删除重复项之后，每个单词也只贡献了几百个候选缩写。 最多 200 个单词，我们就可以轻松地处于基于图形的匹配范围内。 

危险的部分不是产生子序列。 真正的困难是正确处理碰撞。 

考虑这个例子：```
2
abcd
abdc
```这两个词都可以生成`ab`,`ac`,`ad`，以及许多其他人。 根据顺序，将第一个未使用的缩写分配给每个单词的贪婪算法可能会失败。 如果我们给`abcd`缩写`abd`，即使存在不同的全局分配，第二个单词也可能会失去其唯一剩余的选项。 

当一个单词通过不同的索引选择生成重复的子序列时，就会出现另一种微妙的情况。 

例子：```
1
aaaa
```子序列`aa`可以通过多种方式形成，但它只能在候选列表中出现一次。 忘记重复数据删除会使图表变得臃肿，并可能产生不必要的重复边缘。 

还有一种不可能的情况：```
3
a
aa
aaa
```每个单词只能生成缩写`a`。 由于缩写必须不同，因此正确的输出是：```
-1
```仅检查本地可行性的粗心实现会错误地打印重复的缩写。 

## 方法

 最直接的想法就是暴力回溯。 对于每个单词，生成所有有效的缩写，然后递归地尝试分配未使用的缩写。 如果我们成功到达终点，我们就会打印作业。 

这是有效的，因为搜索空间是有限的。 问题在于分支因素。 一个单词可能有大约 300 个不同的缩写。 在最坏的情况下，尝试所有组合都会变得天文数字：$$300^{200}$$

$300^{200}$即使进行了修剪，无限制的回溯也是无望的。 

重要的观察是，这实际上并不是一个排序问题。 这是一个赋值问题。 

每个单词都有一组可接受的缩写。 我们需要为每个单词选择一个不同的缩写。 这正是二分匹配。 

我们构建一个有两侧的图：

 - 左侧：文字。 
- 右侧：作为某个单词的子序列出现的所有不同缩写。 

我们将一个单词与其可以使用的每个缩写连接起来。 

现在的任务是找到一个涵盖每个单词的匹配项。 如果存在这样的匹配，则每个匹配的边都会给出所选的缩写。 

这种转换非常强大，因为最大二分匹配可以自动解决全局冲突。 如果一个单词采用的缩写阻碍了另一个单词，则增广路径过程可以重新排列先前的选择。 

对于标准的基于 DFS 的 Kuhn 算法来说，该图足够小。 最多存在 200 个单词，每个单词最多贡献几百条边。 总图表大小保持可控。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) 递归 | 太慢了 |
 | 最佳 | O(VE) | O(E) | 已接受 |

 ## 算法演练

 1. 读所有单词。 
2. 对于每个单词，生成长度为 1 到 4 的每个不同子序列。 

我们使用递归或组合来枚举位置的子集。 由于必须保留原始顺序，因此选择索引会自动生成有效的子序列。 
3. 将所有不同的缩写压缩为整数 ID。 

匹配算法使用紧凑索引比原始字符串更有效。 
4. 构建二分图。 

左侧每个单词包含一个节点。 右侧包含每个唯一缩写的一个节点。 从单词中添加边缘`i`缩写`j`如果该缩写可以由单词组成。 
5. 运行库恩算法以实现最大二分匹配。 

对于每个单词，尝试找到一条为其分配唯一缩写的增广路径。 如果缩写已经被占用，则递归地尝试将当前匹配的单词重新路由到其他地方。 
6. 统计有多少个单词被成功匹配。 

如果匹配尺寸小于`n`，不存在有效的分配，我们打印`-1`。 
7. 否则重建答案。 

每个匹配的缩写都恰好对应一个单词。 按输入顺序输出这些缩写。 

### 为什么它有效

 该图表准确地包含了每个单词的有效选择。 匹配选择边缘，以便没有两个单词共享相同的缩写。 

如果存在完美匹配，则每个单词都会收到一个唯一的有效缩写。 相反，任何有效的解决方案都直接对应于覆盖所有单词的匹配。 

库恩的算法反复寻找增广路径。 每个增广路径都会将匹配单词的数量增加一个，同时保留唯一性。 由于增广路径是最大二分匹配的基本特征，因此最终的匹配是最大可能的。 如果它的大小等于`n`，存在完整的分配。 

## Python 解决方案```python
import sys
from itertools import combinations

input = sys.stdin.readline

def generate(word):
    s = set()
    m = len(word)

    for length in range(1, min(4, m) + 1):
        for idxs in combinations(range(m), length):
            cur = ''.join(word[i] for i in idxs)
            s.add(cur)

    return list(s)

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]

    abbr_id = {}
    abbr_list = []

    graph = []

    for word in words:
        subs = generate(word)

        edges = []

        for sub in subs:
            if sub not in abbr_id:
                abbr_id[sub] = len(abbr_list)
                abbr_list.append(sub)

            edges.append(abbr_id[sub])

        graph.append(edges)

    m = len(abbr_list)

    match_right = [-1] * m

    def dfs(v, vis):
        for to in graph[v]:
            if vis[to]:
                continue

            vis[to] = True

            if match_right[to] == -1 or dfs(match_right[to], vis):
                match_right[to] = v
                return True

        return False

    matched = 0

    for v in range(n):
        vis = [False] * m

        if dfs(v, vis):
            matched += 1

    if matched != n:
        print(-1)
        return

    ans = [""] * n

    for abbr_idx, word_idx in enumerate(match_right):
        if word_idx != -1:
            ans[word_idx] = abbr_list[abbr_idx]

    print('\n'.join(ans))

solve()
```这`generate`函数枚举长度为 1 到 4 的所有子序列。使用`combinations`很方便，因为选择递增索引会自动保留字符顺序。 这`set`删除重复项，例如多种形成方式`"aa"`从`"aaaa"`。 

图构建阶段为每个唯一缩写分配一个整数 ID。 这种压缩很重要，因为许多单词可能共享相同的候选缩写。 

匹配本身使用 Kuhn 算法的标准 DFS 增广路径实现。 递归调用是关键的一步。 当缩写已经被占用时，我们尝试将当前指定的单词移动到其他地方。 这种重新安排分配的能力使得匹配从根本上比贪婪选择更强。 

这`vis`每次 DFS 尝试都必须重新创建数组。 在迭代中重用它会错误地阻止有效的增强路径。 

最后，存储从缩写到单词的匹配。 算法完成后，我们将该映射反转为所需的输出顺序。 

## 工作示例

 ### 示例 1

 输入：```
6
privet
spasibo
codeforces
java
marmelad
normalno
```生成的缩写非常庞大，因此我们只跟踪成功的匹配决策。 

| 词| 一些候选缩写| 选择|
 | --- | --- | --- |
 | 女贞 |`pr`,`pret`,`pvt`,`riv`|`pret`|
 | 斯帕西博 |`sps`,`spo`,`sbo`|`sps`|
 | 代码力量 |`cdfs`,`code`,`cofs`|`cdfs`|
 | 爪哇 |`j`,`ja`,`java`|`java`|
 | 果酱|`mama`,`mard`,`mela`|`mama`|
 | 正常没有 |`norm`,`nrml`,`nalo`|`norm`|

 输出：```
pret
sps
cdfs
java
mama
norm
```该轨迹显示了匹配的核心属性。 多个单词可能共享候选，但最终分配保证全局唯一性。 

### 示例 2

 输入：```
3
a
aa
aaa
```| 词| 候选缩写|
 | --- | --- |
 | 一个 |`a`|
 | 啊|`a`,`aa`|
 | 啊啊|`a`,`aa`,`aaa`|

 可能的匹配过程：

 | 步骤| 指定缩写 |
 | --- | --- |
 | 匹配单词 1 |`a`|
 | 匹配单词 2 |`aa`|
 | 匹配单词 3 |`aaa`|

 输出：```
a
aa
aaa
```这说明了为什么长度超过 1 的子序列很重要。 尽管所有的言语都共享`a`，较大的单词可以移动到替代缩写。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(VE) | 二部图上的库恩算法 |
 | 空间| O(E) | 邻接表加上匹配数组 |

 这里，`V`是单词数加上缩写词的数量，并且`E`是有效单词缩写对的数量。 

每个单词最多生成 385 个子序列，因此：$$E \le 200 \times 385$$

$200\times385$对于 2 秒限制内的基于 DFS 的匹配实现来说，这已经相当小了。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import combinations

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def generate(word):
        s = set()
        m = len(word)

        for length in range(1, min(4, m) + 1):
            for idxs in combinations(range(m), length):
                s.add(''.join(word[i] for i in idxs))

        return list(s)

    n = int(input())
    words = [input().strip() for _ in range(n)]

    abbr_id = {}
    abbr_list = []
    graph = []

    for word in words:
        edges = []

        for sub in generate(word):
            if sub not in abbr_id:
                abbr_id[sub] = len(abbr_list)
                abbr_list.append(sub)

            edges.append(abbr_id[sub])

        graph.append(edges)

    m = len(abbr_list)

    match_right = [-1] * m

    def dfs(v, vis):
        for to in graph[v]:
            if vis[to]:
                continue

            vis[to] = True

            if match_right[to] == -1 or dfs(match_right[to], vis):
                match_right[to] = v
                return True

        return False

    matched = 0

    for v in range(n):
        vis = [False] * m

        if dfs(v, vis):
            matched += 1

    if matched != n:
        return "-1"

    ans = [""] * n

    for i, v in enumerate(match_right):
        if v != -1:
            ans[v] = abbr_list[i]

    return "\n".join(ans)

# provided-style sample
out = run(
"""6
privet
spasibo
codeforces
java
marmelad
normalno
"""
)

assert len(out.splitlines()) == 6

# minimum case
assert run(
"""1
a
"""
) == "a"

# impossible case
assert run(
"""2
a
a
"""
) == "-1"

# repeated-character subsequences
out = run(
"""3
a
aa
aaa
"""
)

lines = out.splitlines()
assert len(set(lines)) == 3

# boundary length 10
out = run(
"""2
abcdefghij
jihgfedcba
"""
)

assert len(out.splitlines()) == 2
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字`a`|`a`| 最小尺寸输入 |
 | 两个相同的`a`的话|`-1`| 不可能的赋值检测 |
 |`a`,`aa`,`aaa`| 三个不同的缩写 | 匹配重新分配逻辑 |
 | 两个长度为 10 个字 | 任何有效的对 | 最大子序列生成|

 ## 边缘情况

 考虑重复字符的情况：```
1
aaaa
```子序列`aa`可以使用许多索引对生成：

 - 职位`(0,1)`- 职位`(0,2)`- 职位`(1,3)`该算法在添加图边之前将子序列存储在集合中。 结果，该图仅包含一条边`aa`。 这可以防止不必要的重复边缘并保持匹配行为干净。 

现在考虑不可能发生碰撞的情况：```
2
a
a
```这两个词仅生成一个缩写：

 | 词| 候选人|
 | --- | --- |
 | 1 |`a`|
 | 2 |`a`|

 匹配最多可以覆盖一个单词。 运行库恩算法后，匹配大小为`1 < 2`，所以算法打印`-1`。 

最后，考虑贪婪失败但匹配成功的情况：```
2
abcd
abdc
```假设第一个单词最初抓住`abd`。 第二个词稍后可能需要该缩写。 在 DFS 期间，算法探索增广路径，并可以将第一个单词重新分配给另一个有效的缩写，例如`abc`。 这种灵活性正是二分匹配正确解决全局唯一性约束的原因。
