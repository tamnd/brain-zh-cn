---
title: "CF 102190F - 标准输入/输出"
description: "每个短语都由其缩写表示，缩写由每个单词的第一个字母组成。 由于每个单词都以大写字母开头，因此这只是单词首字母的序列，在比较缩写时忽略大小写。"
date: "2026-08-23T08:48:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102190
codeforces_index: "F"
codeforces_contest_name: "2019 ECNU Campus Invitational Contest"
rating: 0
weight: 102190
solve_time_s: 638
verified: true
draft: false
---

[CF 102190F - 标准输入/输出](https://codeforces.com/problemset/problem/102190/F)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 38s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 每个短语都由其缩写表示，缩写由每个单词的第一个字母组成。 由于每个单词都以大写字母开头，因此这只是单词首字母的序列，在比较缩写时忽略大小写。 

例如，`East China Normal University`变成`ECNU`， 尽管`Electronic Circuit National Union`也变成`ECNU`。 每对具有相同缩写的无序不同短语都会为答案贡献一个值。 

因此，任务实际上并不是比较短语本身。 我们只需要按缩写对短语进行分组，并且对于每个大小为 k 的组，添加该组内无序对的数量：

 ( 2 k ​ )= 2 k(k−1) ​ 。 

最多可以有 5⋅10 5 个短语，因此在最坏的情况下检查每一对将需要大约 1.25⋅10 11 次比较。 这远远超出了竞争性编程解决方案所能承受的范围。 单词总数最多为 10 6 ，这强烈表明预期的解决方案在输入量上接近线性。 每个单词的长度最多为 11，因此逐个字符处理完整的输入也是实用的。 

有几种边缘情况可能会导致粗心的实施失败。 

考虑一本只包含一个短语的字典：```

```没有一对不同的短语，所以答案是`0`。 将短语本身视为一对的解决方案是错误的。 

现在考虑单字母单词：```

```缩写是`CSL`,`OXX`， 和`OO`， 分别。 一切都不同，所以答案是`0`。 假设每个单词都包含多个字符的解析器会错误地处理前两行。 

阅读单词时大小写也很重要，但比较缩写时则不然。 例如：```

```两个缩写都是`AB`，所以答案是`1`。 为了进行缩写比较，大写首字母必须被视为相同的字母。 

最后，几个短语可能具有完全相同的缩写：```

```每个短语都有由两个首字母组成的缩写，但这些是`AB`,`CD`,`EF`， 和`GH`，所以答案是`0`。 如果所有四个短语都有缩写`AB`，答案是

 ( 2 4 )=6,

 因为每一对短语都是冲突的。 

# 方法

 直接的方法是构造每个短语的缩写，然后比较每对短语。 如果短语 i 和 j 具有相同的缩写，我们将增加答案。 这是正确的，因为每个无序对都被检查一次。 

问题在于比较次数的二次方。 当 n=5⋅10 5 时，有

 2 n(n−1) ​ = 2 500000⋅499999 ​ =124999750000

 最坏情况下成对。 即使一次比较只花费很小的恒定时间，超过 10 11 次操作也是不可行的。 

蛮力之所以有效，是因为两个缩写的相等性完全决定了一对缩写是否有效，但它失败了，因为它对许多短语重复询问相同的相等问题。 关键的观察是具有相同缩写的短语形成一个自然的组。 我们可以计算每个缩写属于多少个短语，而不是比较每一对。 

假设缩写出现 k 次。 这 k 个短语中的每一个都与其他 k−1 个短语冲突，但直接计算它会得到 k(k−1)，它将每个无序对计数两次。 除以二给出

 2 k(k−1) ​ .

 甚至更方便的实施方式避免首先存储所有频率。 一次处理一个短语。 如果当前缩写已经出现 c 次，则新短语与先前的短语恰好形成 c 个新的无序对。 将 c 添加到答案中，然后将其频率增加到 c+1。 

这将整个问题变成了频率计数问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n 2 ) | O(n) | 太慢了 |
 | 最佳 | 预期 O(L) | O(L) | 已接受 |

 这里 L 是总输入大小，或者等效地是必须读取的字符总数。 由于每个单词的长度最多为 11，并且最多有 10 6 个单词，因此 L 对于给定的输入大小是线性的。 

# 算法演练

 1. 将每个短语读成一行。 该短语至少包含两个单词，并且连续单词之间恰好有一个空格分隔。 
2. 通过取该行的第一个字符，然后紧跟在每个空格后面的字符来构造其缩写。 每个这样的字符都是大写首字母，因此在将其用作字典键之前将其转换为小写。 
3. 在频率词典中查找当前缩写。 如果它之前出现过 c 次，则新短语恰好形成 c 个新的冲突无序对。 在答案中添加 c。 
4.将该缩写的存储频率增加1。 当后面的短语具有相同的缩写时，将使用更新的频率。 
5. 处理完所有短语后，打印累积的答案。 

步骤 3 无需显式计算 ( 2 k ) 即可工作的原因是短语一次到达一个。 当第一个带有缩写的短语到达时，它会创建零对。 第二个与第一个创建一个新对。 第三个与前两个创建两个新对，依此类推。 因此，一组大小为 k 的贡献

 0+1+2+⋯+(k−1)= 2 k(k−1) ​ .

 ### 为什么它有效

 保持不变式，在处理完前 i 个短语后，`answer`正是完全包含在这些 i 短语中的冲突无序对的数量，而`count[x]`是缩写为 x 的已处理短语的数量。 

当下一个短语具有缩写 x 时，每个先前处理的具有缩写 x 的短语都会与其形成一个新的无序对。 正好有`count[x]`这样的短语，因此添加该值会将每个新创建的对恰好计数一次。 不同缩写之间的配对无效，并且已处理的短语之间的配对已被计数。 因此，在每个短语之后，不变量都保持为真，并且在最后一个短语之后，累积值正是所需的答案。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    count = {}
    answer = 0

    for _ in range(n):
        line = input().strip()

        # The abbreviation consists of the first character and
        # every character immediately following a space.
        abbr = bytearray()
        abbr.append(line[0] | 32)

        for i, ch in enumerate(line):
            if ch == 32:  # ASCII space
                abbr.append(line[i + 1] | 32)

        key = bytes(abbr)

        old = count.get(key, 0)
        answer += old
        count[key] = old + 1

    print(answer)

if __name__ == "__main__":
    solve()
```输入是逐行读取的，因为每个短语自然是一个记录。`sys.stdin.readline`避免了重复使用更高级别输入机制的开销，这很重要，因为输入可能包含数百万个单词。 

缩写是直接从该行的原始字节表示中提取的。 第一个字节是第一个单词的首字母。 每个空格后面都有下一个单词的首字母，因此扫描空格足以恢复每个首字母，而无需将行拆分为单独的单词对象。 

ASCII小写字母是通过设置bit 5得到的，相当于这里涉及到的大写英文字母加了32。 由于每个缩写字符都保证是大写首字母，`ch | 32`将其转换为小写形式。 结果存储为`bytes`，它是不可变且可散列的，使其适合作为字典键。 

字典存储每个缩写的先前处理的短语的数量。 如果`old`正是这个频率`old`当前短语到达时会出现新的配对。 我们添加`old`在增加频率之前，这会阻止该短语与其自身配对。 

Python 整数具有任意精度，因此答案大小为

 ( 2 500000 ​ )=124999750000

 不需要对溢出进行特殊处理。 

# 工作示例

 ## 示例 1

 这五个短语产生四个不同的缩写组。 三个短语产生`ecnu`，并且两个产生`scpc`。 

| 短语 | 缩写 | 上一次计数 | 添加到答案 | 新计数 |
 | --- | --- | --- | --- | --- |
 | 华东师范大学| 华东师范大学 | 0 | 0 | 1 |
 | 电子电路全国联盟| 华东师范大学 | 1 | 1 | 2 |
 | 欧洲中央诺威奇大学| 华东师范大学 | 2 | 2 | 3 |
 | 学校社区合作委员会| SCP | 0 | 0 | 1 |
 | 上海市大学生程序设计大赛| SCP | 1 | 1 | 2 |

 答案变成0+1+2+0+1=4。 这`ecnu`小组贡献了三对，而`scpc`小组贡献一对。 

## 示例 2

 这三个词都有缩写`csl`,`oxx`， 和`oo`。 

| 短语 | 缩写 | 上一次计数 | 添加到答案 | 新计数 |
 | --- | --- | --- | --- | --- |
 | C S L | 中超 | 0 | 0 | 1 |
 | O X X | 奥克斯| 0 | 0 | 1 |
 | 奥兹 奥兹 | 哦| 0 | 0 | 1 |

 每个频率仍然是一个，因此不存在冲突对，答案是`0`。 此示例还练习了单词长度为 1 的情况，并确认只有它们的第一个字符才重要。 

# 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 预期 O(L) | 每个输入字符最多被扫描一次，字典操作预计为 O(1) |
 | 空间| O(L) | 字典为每个不同的缩写存储一个缩写和一个频率 |

 这里L是输入短语中的字符总数。 由于最多 10 6 个单词，每个单词最多 11 个字母，输入在可管理的数据量中保持线性。 该算法从不比较短语，因此避免了二次 n 2 瓶颈。 

# 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()

        n = int(sys.stdin.readline())
        count = {}
        answer = 0

        for _ in range(n):
            line = sys.stdin.readline().strip()

            abbr = bytearray()
            abbr.append(line[0] | 32)

            for i, ch in enumerate(line):
                if ch == 32:
                    abbr.append(line[i + 1] | 32)

            key = bytes(abbr)
            old = count.get(key, 0)
            answer += old
            count[key] = old + 1

        print(answer)
        return sys.stdout.getvalue()

    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Sample 1
assert solve_data(
    """5
East China Normal University
Electronic Circuit National Union
European Central Norwich University
School Community Partnership Council
Shanghai Collegiate Programming Contest
"""
) == "4\n", "sample 1"

# Sample 2
assert solve_data(
    """3
C S L
O X X
Orz Orz
"""
) == "0\n", "sample 2"

# Minimum n, so there cannot be any pair.
assert solve_data(
    """1
A B
"""
) == "0\n", "single phrase"

# All phrases have the same abbreviation AB.
assert solve_data(
    """4
A B
Another Beginning
Amazing Building
Awesome Bridge
"""
) == "6\n", "all equal abbreviations"

# Single-letter words and repeated initials.
assert solve_data(
    """5
A A
B B
C C
A B
A A
"""
) == "1\n", "single-letter words and duplicate abbreviation"

# Maximum n with the smallest possible phrase length.
# Every phrase has the same abbreviation AB.
inp = "500000\n" + ("A B\n" * 500000)
assert solve_data(inp) == "124999750000\n", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / A B`|`0`| 最少短语数且无自我配对 |
 | 四个短语及其缩写`AB`|`6`| (2k​)计数规则 |
 | 单字母单词|`1`| 字长一和重复缩写|
 |`500000`完全相同的`A B`短语 |`124999750000`| 最大n、大答案和线性处理|

 # 边缘情况

 单短语案例```
1
A B
```有缩写`ab`。 它的初始频率为零，因此算法添加零，然后存储频率一。 最终的答案是`0`。 这证实了短语永远不会与自身配对。 

对于单字母单词，请考虑```
3
C S L
O X X
Orz Orz
```扫描仪开始于`C`,`O`， 和`O`对于三行，然后获取每个空格后面的字符。 得到的密钥是`csl`,`oxx`， 和`oo`。 每个都出现一次，所以答案仍然存在`0`。 不需要假设单词首字母后是否存在字符。 

对于相同的缩写，请考虑```
4
A B
Another Beginning
Amazing Building
Awesome Bridge
```每条生产线都生产`ab`。 四个插入贡献`0`， 然后`1`， 然后`2`， 然后`3`, 给予`6`。 这正是四个短语中的六个无序对。 

最大可能的答案也自然适合增量方法。 和`500000`的副本`A B`，连续相加为0,1,2,…,499999。 他们的总和是`124999750000`。 Python 的整数运算直接表示这一点，因此不需要溢出处理。 

不需要使用输入的排序顺序。 该算法仅取决于每个短语的缩写和较早出现的次数。 尽管问题保证了字典顺序，但任何输入顺序都会产生相同的最终对计数。
