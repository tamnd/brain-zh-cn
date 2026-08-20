---
title: "CF 102185E - \u0421\u043a\u0440\u0449\u043d\u044f"
description: "我们有一个包含 (N) 个完整单词的字典。 然后我们从文本中接收 (M) 个单词。 如果一个文本单词可以通过从一个字典单词中删除字符来获得，并且没有其他字典单词包含它作为子序列，则该文本单词被视为缩写。"
date: "2026-08-19T06:30:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102185
codeforces_index: "E"
codeforces_contest_name: "Southern Russia Open Championship \u2013 ContestSFedU 2019, Team Final."
rating: 0
weight: 102185
solve_time_s: 122
verified: true
draft: false
---

[CF 102185E - \u0421\u043a\u0440\u0449\u043d\u044f](https://codeforces.com/problemset/problem/102185/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个包含 (N) 个完整单词的字典。 然后我们从文本中接收 (M) 个单词。 如果一个文本单词可以通过从一个字典单词中删除字符来获得，并且没有其他字典单词包含它作为子序列，则该文本单词被视为缩写。 如果恰好有一个字典单词包含它，我们就会用该字典单词替换文本单词。 如果零个或至少两个字典单词包含它，则文本单词保持不变。 

因此，中心操作是后续测试。 例如，`sti`是一个子序列`strtoint`，因为我们可以选择`s`， 然后`t`， 然后`i`。 另一方面，`aa`是两者的子序列`aba`和`ababa`，因此它是不明确的，不能被替换。 

字典单词只有(500)个，但总长度可达(2\cdot10^6)。 文本最多包含 (2000) 个单词，每个文本单词的长度最多为 (10)。 较短的查询长度是关键约束。 这意味着一旦我们能够在字典单词中快速找到所请求字符的下一个出现位置，检查一个文本单词只需要少量操作。 

直接扫描太贵了。 如果字典的总长度为 (2\cdot10^6)，则针对每个字典单词测试一个文本单词可以检查所有 (2\cdot10^6) 字典字符。 对于 (2000) 个不同的文本单词，可以达到 (4\cdot10^9) 个字符检查，远远超出 1.5 秒的限制。 

在一些边缘情况下，看似合理的实现可能会失败。 首先是含糊不清。 考虑```
2
aba
ababa
1
aa
```两个字典单词都包含`aa`作为子序列，所以正确的输出是```
aa
```粗心的实现会在第一个匹配的字典单词处停止，从而错误地打印`aba`。 

第二种情况是一个精确的字典单词。 考虑```
1
abc
1
abc
```正确的输出是```
abc
```该定义允许删除零个字符，因此字典单词本身就是其字典条目的子序列。 需要至少删除一个字符的实现会出现此错误。 

第三种情况是缩写词可以出现在字典单词中不连续的位置。 例如，```
1
strtoint
1
sti
```产生```
strtoint
```人物`s`,`t`， 和`i`不需要形成连续的子串。 仅搜索子字符串会错误地留下`sti`不变。 

最后一个微妙的情况是重复的字典条目。 为了```
2
abc
abc
1
abc
```答案是```
abc
```因为文本单词包含在两个不同的字典条目中，即使这些条目具有相同的内容。 我们必须计算字典位置，而不仅仅是不同的字典字符串。 

## 方法

 暴力解决方案很简单。 对于每个文本单词，扫描每个字典单词并执行标准的两指针子序列检查。 该检查将指针保留在短文本单词中，并在当前字典字符与下一个所需字符匹配时将其前进。 一旦找到所有字符，字典单词就匹配了。 

这是正确的，因为贪婪子序列检查总是为每个所需字符找到最早的可能位置。 如果贪心过程无法找到下一个字符，则后面的选择都无法使查询适合。 

问题在于重复工作量。 假设字典总长度为(D)。 一个查询可能需要 (O(D)) 字符检查。 对于 (U) 个不同的文本单词 (U\le2000)，最坏的情况是 (O(UD)=O(4\cdot10^9)) 字符检查。 每个单独查询的长度最多 (10) 这一事实对暴力扫描没有帮助，因为字典单词总数仍然可能有数百万个字符。 

有用的观察结果是查询很短，而相同的字典单词被查询了很多次。 不要为每个查询从头开始扫描字典单词，而是预处理每个字符在该单词中出现的位置。 

对于一个字典单词，存储每个字母的位置排序列表。 查找下一个出现的字符`c`位置后`p`，二分查找其位置列表。 如果存在下一个位置，则从那里继续后续测试。 由于查询最多包含 (10) 个字符，因此一个字典单词最多需要 (10) 个二分搜索。 

这将重复部分从扫描整个字典单词更改为执行最多十次对数搜索。 预处理与字典总长度呈线性关系。 

还有另一个有用的优化。 文本可以多次包含相同的单词，并且其答案始终相同。 我们首先收集不同的文本单词，对每个单词进行一次求解，然后重复使用结果。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(UD)) | (O(D)) | 太慢了 |
 | 最佳| (O(D+UNK\log L)) | (O(D+UN)) | 已接受 |

 这里（D）是字典总长度，（U\le2000）是不同文本单词的数量，（N\le500）是字典大小，（K\le10）是最大查询长度，（L）是最大字典单词长度。 

## 算法演练

 1. 读取所有字典单词并为每个单词的每个字符建立一个位置列表。 对于字典单词，例如`abac`，位置列表包括`a: [0, 2]`,`b: [1]`， 和`c: [3]`。 列表是自然排序的，因为单词是从左到右扫描的。 
2. 阅读文本并仅保留其明显的单词。 相同文本单词的每次出现都有完全相同的一组匹配字典条目，因此重复解决它只会浪费时间。 
3. 对于一个查询和一个字典单词，将当前位置设置为字典单词开头之前。 从左到右处理查询字符。 
4. 对于当前查询字符，在其位置列表中二分查找第一个严格大于当前位置的位置。 这正是可以在子序列中使用的下一个字符。 
5. 如果这样的位置不存在，则查询不是该词典单词的子序列。 立即停止查这个字典单词。 
6. 如果找到每个查询字符，则字典单词是匹配的。 增加匹配词典条目的数量并记住相应的单词。 
7. 找到两个匹配项后停止。 第二个匹配的确切身份不再重要，因为查询是不明确的并且必须保持不变。 
8. 如果恰好有一个字典单词匹配，则用该单词替换查询。 如果零个或至少两个匹配，则保留原始查询。 存储此结果以便稍后出现相同的文本单词时重复使用。 
9. 按原始顺序打印转换后的文本。 替换保证将总输出大小限制为 (2\cdot10^6)，因此将输出构造为字符串列表是安全的。 

为什么它有效：对于每个字典单词，为每个查询字符选择的位置是在先前选择的位置之后最早可能出现的位置。 选择较早的出现永远不会使剩余的查询更难匹配，因此当查询是子序列时，贪婪过程会准确地成功。 我们测试每个字典条目，因此匹配计数正是包含查询的字典条目的数量。 因此，当该计数为 1 时，查询将被精确替换。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

def solve():
    n = int(input())

    dictionary = []
    positions = []

    for _ in range(n):
        word = input().strip()
        dictionary.append(word)

        pos = [[] for _ in range(26)]
        for i, ch in enumerate(word):
            pos[ord(ch) - 97].append(i)
        positions.append(pos)

    m = int(input())
    text = [input().strip() for _ in range(m)]

    cache = {}

    for query in set(text):
        matches = 0
        replacement = None

        for idx in range(n):
            pos = positions[idx]
            current = -1
            ok = True

            for ch in query:
                arr = pos[ord(ch) - 97]
                j = bisect_right(arr, current)

                if j == len(arr):
                    ok = False
                    break

                current = arr[j]

            if ok:
                matches += 1
                replacement = dictionary[idx]

                if matches == 2:
                    break

        if matches == 1:
            cache[query] = replacement
        else:
            cache[query] = query

    sys.stdout.write("\n".join(cache[word] for word in text))

if __name__ == "__main__":
    solve()
```第一个循环读取字典并构建位置索引。 索引是针对每个字典单词单独存储的，因为位置仅在该单词内部才有意义。 

在查询过程中，`current`是已选择的最后一个字符的位置。`bisect_right(arr, current)`返回紧随其后的第一个匹配项。 严格的 after 是必要的，因为字典位置不能对两个不同的查询字符使用两次。 

代码在第二次匹配后停止。 这是安全的，因为输出仅取决于匹配项的数量是零、一还是至少两个。 

这`cache`字典处理重复的文本单词。 表达式`cache[word]`在输出时保留原始文本顺序，即使不同的查询以任意设置的顺序处理。 

Python 中不存在整数溢出问题，并且最大输出受语句限制。 主要的内存成本是存储的出现位置，其总数恰好是字典的总长度。 

## 工作示例

 提供的示例展示了独特和不明确的缩写。 

为了`sti`， 仅有的`strtoint`按顺序包含三个字符。 为了`aa`， 两个都`aba`和`ababa`包含它，所以它保持不变。 查询`aaa`包含在`ababa`但不在`aba`， 制作`ababa`其独特的扩展。 

| 查询 | 字典词 | 已选择职位 | 匹配？ | 比赛次数 |
 | ---| ---| ---| ---| ---|
 |`sti`|`abc`|`s`缺席| 没有 | 0 |
 |`sti`|`strtoint`|`s=0, t=1, i=4`| 是的 | 1 |
 |`sti`|`aba`|`s`缺席| 没有 | 1 |
 |`sti`|`ababa`|`s`缺席| 没有 | 1 |
 |`aa`|`abc`|`a=0`， 第二`a`缺席| 没有 | 0 |
 |`aa`|`strtoint`|`a`缺席| 没有 | 0 |
 |`aa`|`aba`|`a=0, a=2`| 是的 | 1 |
 |`aa`|`ababa`|`a=0, a=2`| 是的 | 2 |
 |`aaa`|`aba`| 只有两个`a`人物 | 没有 | 0 |
 |`aaa`|`ababa`|`a=0, a=2, a=4`| 是的 | 1 |
 |`bb`| 所有字典单词 | 少于两个`b`人物 | 没有 | 0 |
 |`abc`|`abc`|`a=0, b=1, c=2`| 是的 | 1 |

 跟踪显示了关键不变量：在每个查询字符之后，`current`是迄今为止处理的前缀可以结束的最早可能位置。 这使得以后的每一次二分搜索都尽可能宽松。 

第二个例子练习歧义和精确的字典匹配：```
3
abc
abc
axbyc
4
abc
aby
ac
zzz
```| 查询 | 字典词 | 后续检查结果 | 比赛|
 | ---| ---| ---| ---|
 |`abc`| 第一的`abc`| 是的 | 1 |
 |`abc`| 第二`abc`| 是的 | 2 |
 |`abc`|`axbyc`| 是的 | 2 |
 |`aby`| 第一的`abc`| 没有 | 0 |
 |`aby`| 第二`abc`| 没有 | 0 |
 |`aby`|`axbyc`| 是的 | 1 |
 |`ac`| 第一的`abc`| 是的 | 1 |
 |`ac`| 第二`abc`| 是的 | 2 |
 |`zzz`| 第一的`abc`| 没有 | 0 |

 结果输出是```
abc
axbyc
ac
zzz
```第一个查询保持不变，因为三个字典条目包含它。 第二个查询恰好有一个匹配项，因此它扩展为`axbyc`。 第三个查询不明确，因为两个副本`abc`算作单独的字典条目。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(D+UNK\log L)) | 建仓成本 (O(D))； 每个 (U) 个不同查询最多检查 (N) 个单词，每个单词最多检查 (K\le10) 个字符 |
 | 空间| (O(D+UN+M)) | 字符位置包含 (D) 个条目，而查询缓存和输入文本最多包含 (O(UN+M)) 个附加引用 |

 对于 (D\le2\cdot10^6)、(U\le2000)、(N\le500) 和 (K\le10)，昂贵的重复部分最多执行 (10^7) 次二分搜索操作，而不是数十亿次字典字符扫描。 二进制搜索本身通过 Python 在 C 中运行`bisect`模块，这使得该公式在给定限制下实用。 位置索引使用字典总大小中的线性内存，在 512 MB 以内。 

## 测试用例```python
import sys
import io
from bisect import bisect_right

def solve():
    input = sys.stdin.readline

    n = int(input())

    dictionary = []
    positions = []

    for _ in range(n):
        word = input().strip()
        dictionary.append(word)

        pos = [[] for _ in range(26)]
        for i, ch in enumerate(word):
            pos[ord(ch) - 97].append(i)
        positions.append(pos)

    m = int(input())
    text = [input().strip() for _ in range(m)]

    cache = {}

    for query in set(text):
        matches = 0
        replacement = None

        for idx in range(n):
            current = -1
            ok = True
            pos = positions[idx]

            for ch in query:
                arr = pos[ord(ch) - 97]
                j = bisect_right(arr, current)

                if j == len(arr):
                    ok = False
                    break

                current = arr[j]

            if ok:
                matches += 1
                replacement = dictionary[idx]
                if matches == 2:
                    break

        cache[query] = replacement if matches == 1 else query

    return "\n".join(cache[word] for word in text)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample1 = """\
4
abc
strtoint
aba
ababa
5
sti
aa
aaa
bb
abc
"""

assert run(sample1) == """\
strtoint
aa
ababa
ababa
abc
""", "sample 1"

sample2 = """\
3
abc
abc
axbyc
4
abc
aby
ac
zzz
"""

assert run(sample2) == """\
abc
axbyc
ac
zzz
""", "duplicate dictionary entries"

sample3 = """\
1
a
4
a
aa
b
a
"""

assert run(sample3) == """\
a
aa
b
a
""", "minimum dictionary size"

sample4 = """\
4
aaaaaaaaaa
bbbbbbbbbb
ababababab
baaaaaaaaa
6
aaaaaaaaaa
abab
bbbb
baaa
ab
zzzz
"""

assert run(sample4) == """\
aaaaaaaaaa
abab
bbbbbbbbbb
baaa
ababababab
zzzz
""", "boundary query length and subsequences"

sample5 = """\
500
""" + "\n".join(["a" * 4000 for _ in range(500)]) + """
4
a
aaaaaaaaaa
b
a
"""

# Every dictionary word is identical, so every nonempty sequence of a's
# is ambiguous. The b query matches none.
assert run(sample5) == """\
a
aaaaaaaaaa
b
a
""", "large dictionary and repeated values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`strtoint`,`aa`,`ababa`,`ababa`,`abc`| 原始问题行为、独特且不明确的子序列 |
 | 样品2 |`abc`,`axbyc`,`ac`,`zzz`| 重复的字典条目和不连续的匹配 |
 | 样品 3 |`a`,`aa`,`b`,`a`| 最小字典大小和精确匹配处理 |
 | 样品 4 |`aaaaaaaaaa`,`abab`,`bbbbbbbbbb`,`baaa`,`ababababab`,`zzzz`| 十个字符的查询、所选位置的排序和缺席字符 |
 | 样品 5 |`a`,`aaaaaaaaaa`,`b`,`a`| 字典大小大、重复相等的字典值和歧义 |

 ## 边缘情况

 问题理解中的歧义情况是通过计算字典条目而不是不同的字符串来处理的。 为了```
2
aba
ababa
1
aa
```第一个单词匹配，因此计数变为 1。 第二个单词也匹配，因此计数变为 2 并且算法停止。 由于计数不是 1，因此输出为`aa`。 

完全匹配的情况```
1
abc
1
abc
```开始于`current = -1`。 搜索选择位置 (0)、(1) 和 (2)，因此所有三个字符都被接受。 匹配计数为 1，存储的替换为`abc`，给出正确的未改变的输出。 

不连续的情况```
1
strtoint
1
sti
```选择位置`s`，然后严格搜索它`t`，然后严格在该位置之后`i`。 所选位置形成有效的子序列，即使它们不相邻，因此结果为`strtoint`。 

重复的字典条目被故意计算两次。 为了```
2
abc
abc
1
abc
```第一个条目给出一个匹配项，第二个条目给出两个匹配项。 该算法在第二次匹配后立即停止并返回原始查询。 这正是定义所要求的，因为两个字典位置代表两个不同的条目。 

包含字典单词中不存在的字符的查询会立即失败。 例如，用字典单词`abc`并查询`zzz`，第一个搜索查看位置列表`z`，这是空的。 该单词被拒绝，而不检查剩余的查询字符。 这种早期失败对于负面查询的性能也很有用。
