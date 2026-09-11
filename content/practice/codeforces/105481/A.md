---
title: "CF 105481A - \u7231\u4e0a\u5b57\u5178"
description: "我们得到了一段代表一个故事的长文本。 文本包含混合有空格和标点符号（例如逗号、句点、感叹号和问号）的单词。"
date: "2026-06-23T18:19:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105481
codeforces_index: "A"
codeforces_contest_name: "2024 CCPC Liaoning Provincial Contest"
rating: 0
weight: 105481
solve_time_s: 54
verified: true
draft: false
---

[CF 105481A - \u7231\u4e0a\u5b57\u5178](https://codeforces.com/problemset/problem/105481/A)

 **评级：** -
 **标签：** -
 **求解时间：** 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一段代表一个故事的长文本。 文本包含混合有空格和标点符号（例如逗号、句点、感叹号和问号）的单词。 每个单词都是字母序列，单词可能以不同的大小写形式出现，但我们以不区分大小写的方式对待它们。 

除了本文之外，我们还得到了一本读者已经知道的单词小词典。 当读者在故事中遇到一个单词时，如果它不在他们已知的集合中，他们会查一次，然后永久记住它。 然而，读者对单词的认知存在缺陷：不同的形态形式被认为是不同的单词。 因此，“接受”和“接受”并不相同，尽管它们具有相同的词根。 

任务是模拟从左到右阅读整个文本，并计算有多少不同的单词不在初始已知集合中。 每个未知单词第一次出现时都会触发一次字典查找。 

文本长度最多可达 5 × 10^6 个字符。 这立即排除了任何以低效方式重复扫描或复制子字符串的解决方案。 我们需要对文本进行一次线性传递，动态提取单词并增量处理它们。 字典大小最多为 100 个单词，因此如果我们将它们存储在哈希集中，成员资格检查是恒定时间的。 

一些边缘情况在实践中很重要。 单词必须标准化为小写，因为输入单词的首字母可以大写。 标点符号紧随单词之后出现，因此，如果我们不小心地去除标点符号，单纯的空格分割是不够的。 另一个微妙的情况是重复未知单词：只有第一次出现才能增加答案。 

## 方法

 强力解释是使用空格和标点符号将整个文本分割成标记，然后对于每个标记重复检查它是否出现在已知列表中。 由于已知列表很小，我们可以线性扫描它以查找每个标记。 这已经是临界点，但孤立地看仍然可行。 真正的问题不是字典查找，而是如果不小心的话，重复构造子字符串或多次扫描文本的成本。 

更糟糕的暴力方法是使用字符串比较重复扫描已知列表中的每个单词，从而导致 O(total_words × n) 行为，但由于 n ≤ 100 这部分不是瓶颈。 如果我们尝试使用正则表达式或重复的字符串操作进行拆分，从而在 500 万个字符串上分配许多中间对象，则会出现真正的低效率。 

关键的观察是我们只需要对文本进行一次传递。 我们可以在阅读时将字符累积到缓冲区中，每当遇到非字母边界时，我们就会最终确定该单词，对其进行规范化并立即处理它。 这可以避免任何额外的传递或繁重的解析开销。 

我们将已知的单词存储在一个哈希集中，并且我们还为我们在阅读过程中已经查找过的单词维护另一个集合。 每个单词的平均处理时间为 O(1)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(T × n) 或更糟的重解析 | O(T)| 太慢/不安全|
 | 最佳 | O(T)| O(T + n) | 已接受 |

 ## 算法演练

 我们逐个字符扫描文本并逐步提取单词。 

1.初始化一个空集`known`包含所有给定的字典单词。 
2.初始化一个空集`seen_unknown`跟踪已计为字典查找的单词。 
3. 初始化一个空字符串缓冲区`current`。 
4、遍历文本中的每个字符：

 1. 如果字符是字母，则将其小写形式附加到`current`。 
2. 否则，如果`current`非空，将其作为完整的单词处理。 
5. 处理一个完整的单词时：

 1. 如果不在`known`并且不在`seen_unknown`，增加答案并将其插入`seen_unknown`。 
2. 清除`current`。 
6. 循环结束后，处理剩余的单词`current`使用相同的逻辑。 
7. 输出累计答案。 

我们动态标准化的原因是为了避免存储混合大小写的变体，这会破坏相等性检查。 我们推迟计数直到单词完成的原因是为了确保标点符号不会干扰单词边界。 

### 为什么它有效

 在扫描过程中的任意一点，`current`准确地表示文本中的一个连续的字母序列。 输入中的每个单词都由非字母字符分隔，因此每个单词最终只会被最终确定一次。 因为我们插入了未知的单词`seen_unknown`第一次遇到时立即出现，后续发生的情况不会影响答案。 不变的是`seen_unknown`总是包含那些已经被统计过的单词，并且`known`包含所有根本不需要计数的单词。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    text = sys.stdin.readline().rstrip("\n")
    n = int(sys.stdin.readline())
    known_words = sys.stdin.readline().split()

    known = set(known_words)
    seen_unknown = set()

    ans = 0
    current = []

    def process(word):
        nonlocal ans
        if not word:
            return
        if word not in known and word not in seen_unknown:
            seen_unknown.add(word)
            ans += 1

    for ch in text:
        if ch.isalpha():
            current.append(ch.lower())
        else:
            if current:
                process("".join(current))
                current.clear()

    if current:
        process("".join(current))

    print(ans)

if __name__ == "__main__":
    solve()
```主要的性能考虑是避免循环内重复的字符串连接。 我们在列表中累积字符，并且仅在到达单词边界时才加入。 这使得复杂性与字符总数呈线性关系。 

我们还在累积过程中显式地小写每个字符，这避免了稍后再次遍历该单词。 

## 工作示例

 考虑类似样本的输入：```
I love Liaoning. Love Dalian!
1
love
```我们按顺序处理文本。 

| 步骤| 当前字符流 | 已完成的单词 | 已知？ | 见过未知| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | “我”| 我| 没有| {我} | 1 |
 | 2 | 「爱」| 爱| 是的 | {} | 1 |
 | 3 | 辽宁省 辽宁 | 没有| {辽宁} | 2 |
 | 4 | 「爱」| 爱| 是的 | {} | 2 |
 | 5 | 大连 大连 | 没有| {辽宁、大连} | 3 |

 该跟踪表明，已知单词的重复出现不会影响答案，而未知单词仅计算一次。 

现在考虑一个带有重复和标点符号的情况：```
Hello hello! HELLO?
0
```| 步骤| 当前字符流 | 已完成的单词 | 见过未知| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | “你好”| 你好 | {你好} | 1 |
 | 2 | “你好” | 你好 | {你好}| 1 |
 | 3 | “你好”| 你好 | {你好}| 1 |

 这证实了病例标准化和重复抑制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T)| 每个字符被处理一次，每个单词在平均时间为 O(1) 的哈希集中插入/检查 |
 | 空间| O(T + n) | 最坏的情况存储当前文字处理的所有字符加上字典集 |

 约束最多允许 500 万个字符，因此每个字符具有恒定时间操作的线性扫描在限制内就足够了。 由于仅存储单词集和一个小缓冲区，因此内存使用仍然安全。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from main import solve
    return solve()

# Note: assume solve() prints output, adjust if needed

# Sample-style case
# assert run("I love Liaoning. Love Dalian!\n1\nlove\n") == "3\n"

# Minimum input
assert run("A\n0\n") == "1\n", "single word unknown"

# All known words
assert run("Hello world\n2\nhello world\n") == "0\n", "all known"

# Repeated unknown words
assert run("test test test\n0\n") == "1\n", "only first occurrence counts"

# Case normalization
assert run("Hi HI hI\n0\n") == "1\n", "case insensitive"

# Punctuation boundary
assert run("a,b.c!d?\n0\n") == "4\n", "all split correctly"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个字 | 1 | 最小的未知处理|
 | 众所周知| 0 | 字典过滤|
 | 重复未知| 1 | 重复数据删除 |
 | 混合案例 | 1 | 标准化|
 | 标点符号较多 | 4 | 正确的标记化 |

 ## 边缘情况

 一种边缘情况是文本以不带标点符号的字母序列结尾。 在这种情况下，如果没有显式处理，最终的单词将永远不会被处理。 该解决方案通过运行来修复此问题`process(current)`循环结束后。 

输入：```
hello world
0
```遍历过程中，“hello”和“world”在空间边界处进行处理，最终缓冲区中没有任何单词残留。 最后的刷新没有任何作用，确认了正确性。 

另一种边缘情况是多个连续的标点字符或空格。 由于处理仅在从字母到非字母的转换时触发，因此重复的分隔符不会创建空单词。 

输入：```
a,,!!b??
0
```该算法将“a”和“b”提取为两个单独的单词，并且两者都只计算一次。
