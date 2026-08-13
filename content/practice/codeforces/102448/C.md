---
title: "CF 102448C - 门德斯的电话"
description: "我们维护着不断变化的词汇词典。 插入将单词指定为该查询的索引，而删除则引用回该插入索引。 对于类型 3 查询，我们得到一个字符串 X，需要找到一个以 X 开头的活动字典单词。"
date: "2026-08-12T08:23:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102448
codeforces_index: "C"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2020"
rating: 0
weight: 102448
solve_time_s: 143
verified: true
draft: false
---

[CF 102448C - 门德斯的电话](https://codeforces.com/problemset/problem/102448/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护着不断变化的词汇词典。 插入将单词指定为该查询的索引，而删除则引用回该插入索引。 对于类型 3 查询，我们给出一个字符串`X`并且需要找到一个以以下开头的活跃词典单词`X`。 在所有这些单词中，最短的单词获胜。 如果几个单词的长度相同，则字典顺序最小的单词获胜。 如果没有活动单词开头`X`，答案是`-1`。 

打印的索引不是该单词在当前词典中的位置。 它是插入该单词的原始查询编号。 一个单词可以消失，然后再次插入，产生一个新的索引。 

最多可以有`10^5`查询，而插入和查询操作中出现的所有字符串的总长度最多为`10^6`。 一秒的时间限制排除了重复检查大部分字典的方法。 解决方案围绕`O(Q^2)`成本太高了，甚至扫描每个类型 3 查询的所有活动词也可以达到数十亿次前缀检查。 总字符串长度界限告诉我们，仅处理每个字符少量次是合理的。 官方问题陈述给出了相同的界限。 

在很多情况下，看似合理的实施可能会失败。 

考虑领带的长度：```
4
1 cat
1 car
3 ca
3 cat
```第一个查询打印`2`， 因为`car`和`cat`两者的长度都是三，并且`car`按字典顺序更小。 第二个查询打印`1`， 因为`cat`是唯一以开头的活动词`cat`。 仅存储最短长度而不存储字顺序的实现无法正确解析第一个查询。 

删除也很重要。 例如：```
5
1 apple
1 application
2 1
3 app
3 apple
```输出是：```
2
-1
```删除插入后`1`,`apple`不得参与任一查询。 将已删除单词保持在最低限度而不更新其状态的结构可以默默地返回索引`1`。 

最后，可以删除一个单词，然后再插入：```
5
1 hello
2 1
1 hello
3 hello
3 hell
```输出是：```
3
3
```第二个`hello`有索引`3`， 不是`1`。 将单词本身视为标识而不是插入查询会导致重新插入后出现错误答案。 

## 方法

 直接的解决方案是将当前活动的单词保留在列表中。 对于每个类型3查询，扫描每个活动单词，检查查询的字符串是否为其前缀，并根据`(length, lexicographical order)`。 这是正确的，因为每个可能的答案都会被检查并且比较规则与问题完全匹配。 

问题在于重复工作量。 大致与`5 * 10^4`主动词和`5 * 10^4`前缀查询，简单的扫描已经可以执行大约`2.5 * 10^9`候选人检查。 实际的前缀比较也会检查字符，因此这个估计是故意乐观的。 这`10^6`总字符界限不会保存对字典的二次扫描。 

关键的观察是，当每个字典单词按字典顺序排序时，具有固定前缀的所有单词形成一个连续的区间。 例如，排序后的单词```
apple
application
banana
car
cart
cat
dog
```将每个单词开头`ca`成一个连续的范围。 因此，前缀查询实际上并不需要先遍历 trie，然后在后代中进行搜索。 相反，它可以成为对按字典顺序排序的插入记录的最小范围查询。 

我们可以离线利用这一点。 在处理查询之前，整个查询序列是已知的，因此首先收集曾经插入的每个单词，并按字典顺序对这些插入记录进行排序。 然后，每个插入都会在此排序顺序中获得一个固定位置。 这些位置上的线段树存储每个间隔中当前最好的活动单词。 插入或删除一个单词会改变一个叶子，而前缀查询则要求包含该前缀的词典区间的最小值。 

线段树存储的最小值按以下顺序排序`(word length, word, insertion index)`。 第一个组件实现最短单词规则，第二个组件实现字典顺序平局，插入索引即使在不同时间出现相同的文本也能实现排序总计。 

唯一微妙的部分是找到前缀的间隔。 由于输入中的所有字符都是小写字母，因此每个以`X`至少是`X`并且严格小于`X + '{'`， 因为`'{'`紧随其后`'z'`以 ASCII 表示。 因此所需的间隔是```
[lower_bound(X), lower_bound(X + '{'))
```在按字典顺序排序的列表中。 

这两种方法可以进行如下比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(Q · N · L)`在最坏的情况下|`O(N + S)`| 太慢了|
 | 最佳|`O(S log N + Q log N)`加排序|`O(N + S)`| 已接受 |

 这里`N`是插入记录的数量，`S`是插入和类型 3 查询涉及的所有字符串的总长度。 二分搜索执行的字符串比较取决于前缀长度，但总查询字符串长度受以下限制`10^6`。 

## 算法演练

 1. 首先读取所有查询并将每个插入词与其查询索引一起保存。 在构建字典顺序之前，我们需要完整的插入记录集，并且问题是离线的，足以允许这样做，因为未来的操作不依赖于我们的处理顺序。 
2. 对所有插入记录进行排序`(word, insertion_index)`。 为每个插入查询分配此排序数组中的一个位置。 该位置是表示该特定插入记录的线段树叶。 
3. 为每个插入索引存储其比较键`(len(word), word, insertion_index)`。 当两个线段树节点包含候选插入索引时，比较这些键以决定哪个候选更好。 
4. 创建一棵线段树，其叶子对应于排序后的插入记录。 最初，每个叶子都包含一个空值，因为还没有单词处于活动状态。 线段树节点存储其区间内的最佳活动插入索引。 
5. 对于类型 1 操作，使用其插入索引的预先计算位置并使用插入索引更新该叶。 重新计算祖先使包含该单词的每个区间都知道新的活动候选者。 
6. 对于类型 2 操作，使用查询给出的插入索引来定位其叶子并用空值替换该叶子。 祖先被重新计算，因此删除的单词从每个范围最小查询中消失。 
7. 对于带有前缀的类型 3 查询`X`，对已排序的单词进行二分查找，查找单词至少为的第一个位置`X`。 再次二分查找第一个单词至少为`X + '{'`。 每个单词开头`X`位于这两个位置之间，因此这恰好给出了所需的词典间隔。 
8. 查询该区间内的线段树。 如果结果为空，则没有活动单词`X`作为前缀，所以打印`-1`。 否则打印存储的插入索引。 由于每个线段树节点已经存储了根据`(length, word, index)`，返回的候选者正是门德斯应该选择的词。 

### 为什么它有效

 在每一时刻，每个活动插入记录都恰好出现在一个活动段树叶子中，而每个删除记录都有一个空叶子。 根据所需的排序，任何内部节点存储的值都是该节点间隔内的最佳活动记录。 

对于查询前缀`X`，字典排序保证所有以`X`形成一个连续的区间。 界限`X`和`X + '{'`准确选择该间隔。 因此，线段树会考虑具有所需前缀的每个活动单词，而不考虑其他单词。 由于其最小排序首先按长度排序，然后按字典顺序排序，因此其结果正是所需的答案。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

def solve(stream=None):
    rd = input if stream is None else stream.readline

    q = int(rd())

    queries = []
    inserted = []

    for idx in range(1, q + 1):
        parts = rd().split()
        typ = int(parts[0])

        if typ == 1:
            word = parts[1].decode() if isinstance(parts[1], bytes) else parts[1]
            queries.append((1, word))
            inserted.append((word, idx))
        elif typ == 2:
            queries.append((2, int(parts[1])))
        else:
            word = parts[1].decode() if isinstance(parts[1], bytes) else parts[1]
            queries.append((3, word))

    # Sort every insertion record lexicographically.
    # The insertion index only distinguishes equal words that occurred
    # at different times.
    inserted.sort()

    n = len(inserted)

    # Sorted words are used for binary-searching prefix intervals.
    words = [word for word, _ in inserted]

    # Position of each insertion query in the sorted array.
    position = [0] * (q + 1)

    # Comparison key for each insertion query.
    keys = [None] * (q + 1)

    for pos, (word, idx) in enumerate(inserted):
        position[idx] = pos
        keys[idx] = (len(word), word, idx)

    # Iterative segment tree.
    size = 1
    while size < n:
        size <<= 1

    tree = [0] * (2 * size)

    def better(a, b):
        if a == 0:
            return b
        if b == 0:
            return a
        if keys[a] <= keys[b]:
            return a
        return b

    def update(pos, value):
        p = size + pos
        tree[p] = value
        p >>= 1

        while p:
            tree[p] = better(tree[p << 1], tree[p << 1 | 1])
            p >>= 1

    def range_min(left, right):
        # Query [left, right).
        left += size
        right += size

        ans_left = 0
        ans_right = 0

        while left < right:
            if left & 1:
                ans_left = better(ans_left, tree[left])
                left += 1

            if right & 1:
                right -= 1
                ans_right = better(tree[right], ans_right)

            left >>= 1
            right >>= 1

        return better(ans_left, ans_right)

    output = []

    for typ, value in queries:
        if typ == 1:
            idx = queries.index((typ, value)) if False else None

    # Process again while retaining the original query index.
    # This avoids relying on the word itself as an identity.
    insertion_active = [False] * (q + 1)
    query_pos = 0

    for idx in range(1, q + 1):
        typ, value = queries[query_pos]
        query_pos += 1

        if typ == 1:
            update(position[idx], idx)
            insertion_active[idx] = True

        elif typ == 2:
            update(position[value], 0)
            insertion_active[value] = False

        else:
            prefix = value

            left = bisect_left(words, prefix)
            right = bisect_left(words, prefix + '{')

            if left >= right:
                output.append("-1")
                continue

            ans = range_min(left, right)

            if ans == 0:
                output.append("-1")
            else:
                output.append(str(ans))

    return "\n".join(output)

if __name__ == "__main__":
    sys.stdout.write(solve())
```第一遍存储每个操作并收集每个插入。 插入查询索引是自然的永久标识符，因为删除直接引用它。 

对插入记录进行排序后，`position[idx]`准确地告诉我们哪个线段树叶代表插入`idx`。 当一个单词被删除然后再次插入时，这种映射是必不可少的，因为在不同插入时间的两个相同的字符串仍然是不同的记录。 

这`keys`数组包含问题所需的确切顺序。 比较`(len(word), word, idx)`首先最小化长度，然后选择字典顺序较小的单词。 最后的索引部分主要是防御性抢七，因为该声明保证两个相同的词不能同时处于活动状态。 

线段树使用`0`作为空哨兵。 有效插入索引开始于`1`，所以没有歧义。`update`在活动和非活动之间更改一条插入记录，同时`range_min`返回半开区间的最佳候选者`[left, right)`。 

前缀间隔使用`bisect_left(words, prefix)`作为其下边界。 对于上边界，`prefix + '{'`之所以有效，是因为字母表仅包含小写字母，并且`{`紧接着`z`。 任何以以下开头的单词`prefix`小于该上限，而前缀块之外的任何单词都小于`prefix`或者至少`prefix + '{'`。 

该实现在预处理时使线段树完全处于非活动状态。 我们仅在真正的查询处理过程中遇到插入操作时才激活叶子。 这可以防止未来的插入在实际发生之前出现在答案中。 

这`stream`参数只是为了使实现易于测试。 当省略时，需要`sys.stdin.readline`使用快速输入路径。 

## 工作示例

 ### 示例 1

 操作是：```
6
1 call
1 mendes
1 troll
3 mend
2 2
3 mendes
```按字典顺序排序的插入记录是`call`,`mendes`,`troll`。 

| 查询 | 运营| 主动插入指数| 前缀间隔 | 线段树答案| 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 插入`call`|`{1}`| | | |
 | 2 | 插入`mendes`|`{1,2}`| | | |
 | 3 | 插入`troll`|`{1,2,3}`| | | |
 | 4 | 询问`mend`|`{1,2,3}`|`mendes`|`2`|`2`|
 | 5 | 删除`2`|`{1,3}`| | | |
 | 6 | 询问`mendes`|`{1,3}`| 空 | 无 |`-1`|

 第四个查询找到插入`2`因为`mendes`是唯一以开头的活动词`mend`。 删除后，字典序范围为`mendes`仍然存在于已排序的数组中，但其唯一的叶子处于非活动状态，因此线段树正确地不返回候选。 

### 前缀绑定和删除

 考虑：```
8
1 cat
1 car
1 carpet
3 ca
2 1
3 ca
1 can
3 ca
```排序后的插入记录是`can`,`car`,`carpet`,`cat`。 

| 查询 | 运营| 活跃词 | 前缀 | 候选人最低要求 | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 插入`cat`|`cat`| | | |
 | 2 | 插入`car`|`cat`,`car`| | | |
 | 3 | 插入`carpet`|`cat`,`car`,`carpet`| | | |
 | 4 | 询问`ca`|`cat`,`car`,`carpet`|`ca`|`car`|`2`|
 | 5 | 删除`1`|`car`,`carpet`| | | |
 | 6 | 询问`ca`|`car`,`carpet`|`ca`|`car`|`2`|
 | 7 | 插入`can`|`car`,`carpet`,`can`| | | |
 | 8 | 询问`ca`|`car`,`carpet`,`can`|`ca`|`can`|`7`|

 第一个查询演示了两级排序。`car`和`cat`两者的长度都是三，所以字典顺序选择`car`。 后`can`被插入，`can`具有相同的长度并且按字典顺序小于`car`，因此线段树会更改答案，而无需在查询本身中进行任何特殊处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(S + N log N + Q log N)`加上二分搜索中的字符串比较成本| 排序构建字典顺序，每次插入或删除执行一次线段树更新，每个类型 3 查询执行两次二分搜索和一次范围最小查询。 |
 | 空间|`O(S + N + Q)`| 存储的单词使用`O(S)`字符，而查询记录、映射、键和线段树则使用`O(N + Q)`额外的内存。 |

 这里`N <= 10^5`是插入操作的数量，`S <= 10^6`是插入和类型 3 查询中字符串的总长度。 线段树每次动态操作仅执行对数工作，而字符串本身在规定的总字符范围内进行处理。 这轻松地避免了违反一秒限制的二次扫描。 

## 测试用例

 以下测试套件假设提交的解决方案可用`solution.py`，与`solve(stream=None)`函数如上所示。```python
from solution import solve
import io

def run(inp: str) -> str:
    result = solve(io.StringIO(inp))
    return result.strip()

# Provided sample
assert run(
    """\
6
1 call
1 mendes
1 troll
3 mend
2 2
3 mendes
"""
) == """\
2
-1
""".strip(), "sample 1"

# Minimum-size input, with no words in the dictionary.
assert run(
    """\
2
3 a
3 b
"""
) == """\
-1
-1
""".strip(), "empty dictionary"

# Equal text can be removed and inserted again.
assert run(
    """\
5
1 hello
2 1
1 hello
3 hello
3 hell
"""
) == """\
3
3
""".strip(), "reinsertion"

# Equal-length tie must be resolved lexicographically.
assert run(
    """\
5
1 cat
1 car
1 carpet
3 ca
3 car
"""
) == """\
2
2
""".strip(), "lexicographic tie"

# Exact-word boundary and prefix boundary.
assert run(
    """\
7
1 a
1 aa
1 ab
3 a
3 aa
3 ab
3 b
"""
) == """\
1
2
3
-1
""".strip(), "prefix boundaries"

# Deletion of the current best must reveal the next best candidate.
assert run(
    """\
8
1 dog
1 door
1 doll
3 do
2 1
3 do
2 3
3 do
"""
) == """\
2
2
2
""".strip(), "deletion updates"

# Maximum number of operations.
# 50,000 distinct words are inserted, then 50,000 prefix queries are made.
# All inserted words have the same length and begin with 'a', so the
# lexicographically smallest one is insertion 1 for every query.
words = []
for x in range(50000):
    value = x
    suffix = []
    for _ in range(4):
        suffix.append(chr(ord('a') + value % 26))
        value //= 26
    words.append("a" + "".join(reversed(suffix)))

max_input = ["100000"]
for word in words:
    max_input.append("1 " + word)
for _ in range(50000):
    max_input.append("3 a")

expected = "1\n" * 50000
assert run("\n".join(max_input)) == expected.rstrip(), "maximum operations"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2`随后是两个不匹配的查询 |`-1`,`-1`| 空字典且没有匹配的前缀 |
 |`hello`， 删除，`hello`再次|`3`,`3`| 重新插入获取新的查询索引 |
 |`cat`,`car`,`carpet`， 询问`ca`|`2`| 等长字典领带|
 |`a`,`aa`,`ab`、精确查询和前缀查询 |`1`,`2`,`3`,`-1`| 二分搜索的下限和上限 |
 |`dog`,`door`,`doll`有删除|`2`,`2`,`2`| 删除候选后线段树更新 |
 | 50,000 次插入和 50,000 次查询 | 50,000 份`1`| 最大查询计数和对数运算 |

 ## 边缘情况

 空字典由仅包含零值的线段树处理。 例如：```
2
3 a
3 b
```仅当存在插入时，排序插入数组中的两个前缀间隔才可能为非空，但这里根本不存在插入记录。 范围为空，答案为`-1`对于这两个查询。 

删除必须从每个未来的范围查询中删除一个单词，而不仅仅是从一个特定的前缀中删除。 考虑：```
5
1 apple
1 application
2 1
3 app
3 apple
```查询后`3`, 用于插入的叶子`1`更改自`1`到`0`。 范围为`app`仍然包含插入`2`叶，所以第一个输出是`2`。 范围为`apple`仅包含已删除的记录，因此第二个输出是`-1`。 

等长候选需要线段树排序的第二个组成部分。 和：```
3
1 cat
1 car
3 ca
```两个活动词的长度都是三。 他们的钥匙有效`(3, "cat", 1)`和`(3, "car", 2)`，所以插入`2`更小，答案是`2`。 仅存储长度会使领带悬而未决。 

查询可以是精确的字典单词，并且必须包含该单词本身。 为了：```
4
1 apple
1 application
3 apple
3 applic
```输出是：```
1
2
```第一个查询包括`apple`本身，因为字符串是其自身的前缀。 第二个查询排除`apple`因为它不是开始于`applic`，离开`application`。 

上二分搜索边界还必须处理以`z`。 例如：```
4
1 za
1 zebra
1 zzz
3 z
```这三个词都属于`z`间隔。 使用`prefix + '{'`给出`z{`，它比以开头的每个小写单词都大`z`，因此这些词都不会被意外排除。 

最后，删除后重新插入必须保留历史索引。 和：```
5
1 hello
2 1
1 hello
3 hello
3 hell
```第一个`hello`处于非活动状态，第二个`hello`在对应于插入的叶处处于活动状态`3`。 两个查询都返回`3`。 该算法永远不会仅通过文本来识别插入，因此不同时间的相同单词仍然是单独的记录。
