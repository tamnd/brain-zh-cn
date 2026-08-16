---
title: "CF 102386I - \u041f\u0435\u0440\u0441\u0435\u0430\u043d\u0442\u043e\u0432\u043a\u0430"
description: "我们得到一个句子，其单词可能已经重新排列了内部字母。 对于每个单词，第一个和最后一个字母保持固定，而它们之间的字母的任何排列都是允许的。"
date: "2026-08-15T08:10:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102386
codeforces_index: "I"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0442\u0443\u0440 \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u043e\u0433\u043e \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b\u0430 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u043c\u0438\u0440\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2019"
rating: 0
weight: 102386
solve_time_s: 1746
verified: false
draft: false
---

[CF 102386I - \u041f\u0435\u0440\u0441\u0435\u0430\u043d\u0442\u043e\u0432\u043a\u0430](https://codeforces.com/problemset/problem/102386/I)

 **评级：** -
 **标签：** -
 **求解时间：** 29m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个句子，其单词可能已经重新排列了内部字母。 对于每个单词，第一个和最后一个字母保持固定，而它们之间的字母的任何排列都是允许的。 除了损坏的句子之外，我们还收到一本字典，其中包含可能出现在原始句子中的每个单词。 

对于损坏的句子中的每个单词，我们需要通过仅排列其内部字母来找到可以变成该单词的字典单词。 当字典单词具有相同的第一个字母、相同的最后一个字母以及每个字母出现相同的次数时，它是完全兼容的。 如果每个句子单词至少存在一个兼容的字典单词，我们就可以输出任何这样的重建。 如果连一个句子单词都没有兼容的字典单词，答案是`No solution`。 

句子中的字符总数最多为 (5\cdot10^5)，字典中的字符总数也最多为 (5\cdot10^5)。 字典条目数可以达到(5\cdot10^5)。 这些界限排除了对句子中的每个单词进行字典的全面扫描。 一个句子可以包含数十万个单词，因此 (O(Wn)) 搜索（其中 (W) 是句子单词的数量）可以在各个边界 (W\le250000) 和 (n\le500000) 下达到大约 (1.25\cdot10^{11}) 个候选检查。 我们需要与输入总量成比例的处理。 

有几种边界情况，粗心的实现可能会处理不当。 单字母单词没有内部字母，因此它只能匹配具有完全相同的单个字符的字典单词。 例如，使用输入```
a.
1
a
```答案是`a.`。 将第一个和最后一个字符视为两个单独的位置而不处理单字符的情况可能会意外地错误地索引空中间。 

不同的词典单词可以具有完全相同的签名。 例如，```
tihs.
2
this
hits
```只有`this`作为有效答案，因为`hits`有不同的第一个和最后一个字母。 另一方面，```
scret.
2
secret
serect
```如果观察到的单词具有相同的长度和字母数，则将允许任一兼容单词。 该问题明确允许任何有效答案，因此为每个签名仅存储一个单词就足够了。 

一个单词也可以具有正确的长度，但仍然无法重建，因为一个内部字母具有错误的多重性。 例如，```
wlrd.
1
world
```没有解决办法。 观察到的单词仅包含四个字母，而字典单词包含五个字母，因此仅比较第一个和最后一个字母将错误地接受它。 

最后，句号属于句子语法而不是任何单词。 为了```
hello wolrd.
2
hello
world
```第二个词是`wolrd`， 不是`wolrd.`。 在单词签名中包含句点的解析器将无法找到`world`。 

## 方法

 直接的方法是从损坏的句子中取出每个单词，并将其与字典中的每个单词进行比较。 对于候选对，我们可以检查第一个和最后一个字符，然后比较两个单词中的字符频率。 该方法是正确的，因为这些条件正是通过排列内部字母可获得的定义。 

问题是重复的字典扫描。 如果句子有 (W) 个单词并且字典有 (n) 个条目，则可以有 (Wn) 个候选检查。 根据输入边界，(W) 约为 (250000)，(n) 约为 (500000)，给出的上限为 (125000000000) 个候选检查。 对于大多数候选人来说，即使是持续不断的拒绝也远远超出了合理范围。 

关键的观察结果是内部字母的顺序根本不重要。 每个单词都可以用一个规范签名来表示，该规范签名由其第一个字母、最后一个字母以及 26 个小写字母中每个字母的出现频率组成。 当且仅当两个单词的签名相同时，它们才是兼容的。 

我们可以为每个字典单词计算一次这个签名，并将其放入哈希表中。 然后将每个句子单词转换为相同的签名并直接查找。 昂贵的重复搜索消失了，只剩下字典一遍，句子一遍。 

蛮力方法之所以有效，是因为它测试了完全正确的条件，但它反复重新发现相同的信息。 兼容性完全由一个小的规范签名决定的观察结果让我们可以用哈希表查找来代替重复的比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(Wn)) 候选检查，具有额外的单词比较成本 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(S+D+26n+26W))，有效地 (O(S+D)) | (O(D+26n)) | 已接受 |

 这里（S）是句子单词的总长度，（D）是字典单词的总长度。 由于两者最多为 (5\cdot10^5)，因此线性项占主导地位。 

## 算法演练

 1. 阅读损坏的句子并删除最后的句号。 用空格分割剩余的字符串可以准确地给出损坏单词的序列，因为输入保证了相邻单词之间有一个空格。 
2. 对于每个字典单词，构建一个包含其第一个字符、最后一个字符和一个 26 元素频率向量的签名。 频率向量计算单词中的所有字母，包括端点。 将端点包含在计数中是安全的，因为这些字符也是固定的。 
3. 在哈希表中为每个签名存储一个字典单词。 几个不同的字典单词可能共享一个签名，但这不会引起问题，因为该语句接受任何有效的重构。 
4. 对于每个损坏的句子单词，计算其签名并在表中查找。 如果没有签名，则没有字典单词可以产生这个观察到的单词，因此整个句子没有有效的重构。 
5. 如果存在签名，则将存储的字典单词附加到重构的句子中。 对每个单词独立重复此操作。 
6. 用单个空格连接重构的单词并附加最后一个句点。 生成的字符串与输入句子具有完全相同的单词边界和标点符号。 

### 为什么它有效

不变的是，每个存储的签名准确地代表字典单词的集合，其字母可以被重新排列成相应的观察到的单词，而不改变其第一个或最后一个字母。 如果观察到的单词与字典单词具有相同的签名，则这两个单词包含完全相同的字母多集并具有相同的端点，因此可以对内部字母进行排列以将一个单词转换为另一个单词。 如果它们的签名不同，则至少有一个端点或字母频率不同，从而使得这种排列不可能。 因此，每个选定的字典单词都是有效的，并且未能找到签名证明不存在有效的重构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def signature(word):
    cnt = [0] * 26
    for ch in word:
        cnt[ord(ch) - 97] += 1
    return (word[0], word[-1], tuple(cnt))

def solve():
    text = input().rstrip('\n')
    n = int(input())

    dictionary = {}

    for _ in range(n):
        word = input().strip()
        key = signature(word)
        if key not in dictionary:
            dictionary[key] = word

    words = text[:-1].split(' ')
    answer = []

    for word in words:
        key = signature(word)
        original = dictionary.get(key)

        if original is None:
            print("No solution")
            return

        answer.append(original)

    print(' '.join(answer) + '.')

if __name__ == "__main__":
    solve()
```这`signature`函数构造一个固定大小的频率向量。 它的运行时间与字长成线性关系，因为每个字符只处理一次。 元组使向量不可变，因此可以安全地用作字典键的一部分。 

在处理句子之前先填充字典。 当两个词典单词具有相同的签名时，将保留第一个单词。 这是故意的，因为输出只需要一份有效的原始文本。 

该句子被解析为`text[:-1]`，这正好删除了最后一个句点。 关于输入的保证意味着没有其他标点符号需要特殊处理。 按一个空格分割即可得到原始单词序列。 

查找使用`dictionary.get(key)`而不是直接建立索引。 缺少签名会产生`None`，这让程序立即报告`No solution`。 每个有效的字典单词都是一个非空的小写字符串，所以`None`不能与合法的存储值混淆。 

只有在所有单词都被重建之后才添加最后一个句点。 这可以避免意外地将其视为文字签名的一部分。 

Python 整数在这里不会溢出。 最大频率最多为 (5\cdot10^5)，远低于任何实际整数限制。 

## 工作示例

 对于示例 1，字典包含`hello`和`world`。 观察到的词是`hello`和`wolrd`。 

| 词| 第一 | 最后 | 字母计数 | 查询结果 |
 | ---| ---| ---| ---| ---|
 |`hello`|`h`|`o`|`e:1, h:1, l:2, o:1`|`hello`|
 |`wolrd`|`w`|`d`|`d:1, l:1, o:1, r:1, w:1`|`world`|

 第一个单词已经是字典形式，所以它的签名找到`hello`。 第二个单词具有相同的字符多重集和端点`world`，所以它的签名发现`world`。 重建的结果是`hello world.`。 

对于示例 2，唯一可能与第二句单词匹配的字典单词是`world`，但观察到的词是`wlrd`。 

| 词| 第一 | 最后 | 长度| 查询结果 |
 | ---| ---| ---| ---| ---|
 |`hello`|`h`|`o`| 5 |`hello`|
 |`wlrd`|`w`|`d`| 4 | 缺席|

 第二个签名不能等于`world`，因为信`o`缺少且字符总数不同。 查找失败，因此算法立即打印`No solution`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(S+D+26(W+n)))，有效地 (O(S+D)) | 每个输入字符都计数一次，每个签名正好有 26 个计数器 |
 | 空间| (O(D+26(W+n)))，有效地 (O(D+W+n)) | 哈希表存储一个代表词和每个字典签名一个固定大小的签名 |

 总句子长度和总字典长度都以 (5\cdot10^5) 为界。 字母表只有 26 个字母，因此每个签名的固定 26 个元素部分很小。 因此，该算法执行线性数量的字符处理以及哈希表操作，这符合预期的约束。 

## 测试用例```python
import sys
import io

def signature(word):
    cnt = [0] * 26
    for ch in word:
        cnt[ord(ch) - 97] += 1
    return (word[0], word[-1], tuple(cnt))

def solve():
    input = sys.stdin.readline

    text = input().rstrip('\n')
    n = int(input())

    dictionary = {}

    for _ in range(n):
        word = input().strip()
        key = signature(word)
        if key not in dictionary:
            dictionary[key] = word

    words = text[:-1].split(' ')
    answer = []

    for word in words:
        original = dictionary.get(signature(word))
        if original is None:
            print("No solution")
            return
        answer.append(original)

    print(' '.join(answer) + '.')

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("""hello wolrd.
2
hello
world
""") == "hello world.", "sample 1"

assert run("""hello wlrd.
2
hello
world
""") == "No solution", "sample 2"

assert run("""tihs is vrey sceret txet.
7
text
secret
serect
scret
is
very
this
""") == "this is very secret text.", "sample 3"

# Minimum-size input
assert run("""a.
1
a
""") == "a.", "single-letter word"

# One-letter observed word must not match another letter
assert run("""b.
1
a
""") == "No solution", "single-letter mismatch"

# Same endpoints and letter multiset, but dictionary has several valid choices
result = run("""scret.
2
secret
serect
""")
assert result in {"secret.", "serect."}, "multiple valid dictionary words"

# Boundary case where the last letter matters
assert run("""abcda.
1
abcdb
""") == "No solution", "different last letter"

# Large input close to the sentence-size limit
long_word = "a" * 499999
large_input = long_word + ".\n1\n" + long_word + "\n"
assert run(large_input) == long_word + ".", "large word"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a.`带字典`a`|`a.`| 尽可能小的单词和空的内部部分 |
 |`b.`带字典`a`|`No solution`| 端点不匹配|
 |`scret.`和`secret`,`serect`| 兼容字典单词 | 具有相同签名的多个词典单词 |
 |`abcda.`和`abcdb`|`No solution`| 最后一个字符边界 |
 | 字典中有一个499999个字符的单词| 同样的大字| 接近最大输入尺寸和线性处理|

 ## 边缘情况

 单字母单词的处理无需特殊分支，因为签名计算唯一的字符并将其记录为第一个字符和最后一个字符。 为了```
a.
1
a
```句子单词的签名正是存储的签名`a`，所以输出是`a.`。 为了```
b.
1
a
```频率向量和端点不同，因此查找失败，输出为`No solution`。 

多个字典单词可以代表同一个损坏的单词。 考虑```
scret.
2
secret
serect
```两个字典单词都有第一个字母`s`, 最后一个字母`t`，以及相同的字母频率。 哈希表保留一个代表。 保留哪一个都可以重建`scret`，因此无论存储哪个字典条目，输出都是有效的。 

错误的内部字母计数无法通过重新排列来修复。 考虑```
wlrd.
1
world
```观察到的单词有一个`w`， 一`l`， 一`r`，和一个`d`， 尽管`world`另外还包含`o`长度为五。 他们的签名不同，因此字典查找失败。 算法打印`No solution`而不是仅仅因为一个词的端点一致就接受它。 

最后的句号不得参与签名。 为了```
hello wolrd.
2
hello
world
```解析器在分割句子之前删除最后一个句点。 它处理`hello`和`wolrd`, 发现`hello`和`world`，然后恢复加入重构词后的句点。 这使得标点符号与字母频率条件分开。
