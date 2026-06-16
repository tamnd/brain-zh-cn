---
title: "CF 1089J - JS 缩小"
description: "我们得到了一个小的编程语言源文件以及一组保留的标记。 原始源可能包含注释、任意空格和用户定义的标识符。"
date: "2026-06-13T03:46:36+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1089
codeforces_index: "J"
codeforces_contest_name: "2018-2019 ICPC, NEERC, Northern Eurasia Finals (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 3200
weight: 1089
solve_time_s: 364
verified: false
draft: false
---

[CF 1089J - JS 缩小](https://codeforces.com/problemset/problem/1089/J)

 **评分：** 3200
 **标签：** 贪心，实现
 **求解时间：** 6m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个小的编程语言源文件以及一组保留的标记。 原始源可能包含注释、任意空格和用户定义的标识符。 解析器根据语言规则删除注释、跳过空格并重复提取最长的有效标记。 

该任务有两个不同的部分。 

首先，我们必须重建源所表示的确切标记序列。 在此过程中，注释消失，间距变得无关紧要。 

其次，每个用户定义的单词都必须根据确定性方案进行重命名。 遇到的第一个不同的单词成为第一个可用的小写标识符，第二个不同的单词成为第二个可用的小写标识符，依此类推。 保留的令牌不包含在此生成的标识符序列中。 

重命名后，我们必须打印一行，其标记化恰好生成重命名的标记序列。 在所有此类输出中，我们需要一个具有尽可能少的空格数的输出。 

限制小得惊人。 最多有 40 个保留标记，最多 40 行源代码，每行长度最多为 80。整个输入只有几千个字符。 这意味着我们不需要复杂的解析机制。 即使复杂度与源长度的平方成正比的算法也是完全安全的。 

困难的部分不是效率。 挑战在于正确地再现解析器的最长匹配行为，并准确确定相邻输出标记之间何时需要空格。 

一些边缘情况很容易被忽略。 

考虑作为其他保留令牌的前缀的保留令牌。```
Reserved: + ++
Source: ++
```解析器必须生成令牌`++`，不是两个`+`代币。 接受第一个匹配的保留标记而不是最长的匹配标记的解析器将产生错误的标记序列。 

考虑也满足单词定义的保留标记。```
Reserved: while
Source: while abc
```代币`while`已保留且绝不能重命名。 将每个字母数字字符串视为一个单词会错误地重命名它。 

考虑合并成更大单词的相邻标记。```
Tokens: a b
```印刷`ab`没有空格会将解析结果从两个单词更改为一个单词。 至少需要一个空格。 

相反的情况也会发生。```
Tokens: a +
```印刷`a+`是完全安全的。 添加空格只会使结果更长。 

一个特别微妙的情况是两个保留令牌连接成另一个保留令牌。```
Reserved: + ++
Tokens: + +
```印刷`++`将被解析为单个`++`令牌，因为解析器总是采用最长的可能令牌。 即使两个标记都不是单词或数字，空格也是必需的。 

准确理解何时可以在没有分隔符的情况下写入相邻标记是问题的核心。 

## 方法

 蛮力观点对于理解优化问题很有用。 

获得重命名的token序列后，假设有`k`代币。 在每个相邻对之间，我们可以插入空格，也可以不插入空格。 有`2^(k-1)`可能的输出。 对于每个候选输出，我们可以再次运行解析器并检查它是否重建了所需的标记序列。 最短的有效答案就是答案。 

这种方法是正确的，因为它明确地测试了每种可能的空间放置方式。 不幸的是，即使是几十个令牌也已经使搜索空间成为天文数字。 

关键的观察是两个相邻标记之间的决策完全是局部的。 

假设我们已经重命名了所有标识符。 考虑两个连续的输出标记`A`和`B`。 

如果写`A+B`导致解析器生成完全相同的两个标记，然后省略空格总是更好，因为空格只会增加长度。 

如果写`A+B`导致解析器产生其他任何内容，那么空格是必需的。 

与其他职位没有互动。 标记之间是否需要分隔符`i`和`i+1`仅取决于这两个标记。 

这将问题简化为两个独立的任务。 

首先，恢复并重命名令牌序列。 

其次，对于每个相邻对，确定串联是否会改变解析结果。 

由于输入大小很小，我们可以简单地重用解析器本身。 一对`(A,B)`，解析字符串`A+B`。 如果结果正好`[A,B]`，不需要空间。 否则，插入一个空格。 

从原始源中提取标记的相同最长匹配解析器也可以回答间距问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^k·k) | O(2^k·k) | O(k) | 太慢了 |
 | 最佳| O(T + k · L²) | O(T + k · L²) | O(T)| 已接受 |

 这里`T`是源的总长度，`L`是最大令牌长度。 由于所有限制都很小，因此这很容易足够快。 

## 算法演练

 ### 解析模型

 解析器必须与语句完全匹配。 

在任何位置：

 1. 跳过空格。 
2. 从当前位置开始的所有保留令牌中，如果存在，则取最长的一个。 
3. 否则，如果当前字符是数字，则消耗最长的数字序列并创建数字令牌。 
4. 否则，消耗最长的有效单词并创建单词标记。 

保证输入有效。 

### 单词生成

 目标标识符序列由小写单词组成，首先按长度排序，然后按字典顺序排序：```
a, b, ..., z, aa, ab, ...
```任何本身就是保留令牌的标识符都必须被跳过。 

### 重命名

 遍历已解析的令牌序列时：

 1. 如果 token 不是单词，则保持不变。 
2. 如果该token是保留token，则保持不变。 
3. 否则，如果该单词以前没有出现过，则分配下一个可用的生成标识符。 
4. 将每个出现的原始单词替换为其分配的标识符。 

### 最小间距

 对于每对相邻的重命名标记`(A,B)`:

 1. 形成字符串`A+B`。 
2. 使用相同的分词器解析该字符串。 
3. 如果结果恰好是二标记序列`[A,B]`, 附加`B`紧接着`A`。 
4.否则在前面插入一个空格`B`。 

单个空格始终足够，因为在标记化之前会跳过空格。 

### 为什么它有效

 解析器是确定性的，并且总是在每个位置选择最长的有效标记。 

重命名后，目标token序列就固定了。 唯一剩下的自由是在哪里放置空间。 

对于任何相邻对，在解析串联并重现这两个标记时，省略分隔符是完全有效的。 如果没有，那么没有分隔符的输出就无法保留标记序列，因为解析器将以不同的方式解释边界。 

由于每个空间决策仅取决于一对相邻的空间，并且空间永远不会减少长度，因此最佳策略是尽可能省略空间并仅在必要时插入空间。 将此规则独立地应用于每个边界会产生尽可能小的空间总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

WORD_CHARS = set(
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789_$"
)

def is_word_start(c):
    return c.isalpha() or c == '_' or c == '$'

def tokenize(text, reserved):
    tokens = []
    i = 0
    n = len(text)

    while i < n:
        while i < n and text[i] == ' ':
            i += 1
        if i >= n:
            break

        best = None
        best_len = 0

        for tok in reserved:
            if text.startswith(tok, i) and len(tok) > best_len:
                best = tok
                best_len = len(tok)

        if best is not None:
            tokens.append(best)
            i += best_len
            continue

        c = text[i]

        if c.isdigit():
            j = i
            while j < n and text[j].isdigit():
                j += 1
            tokens.append(text[i:j])
            i = j
            continue

        j = i
        while j < n and text[j] in WORD_CHARS:
            j += 1
        tokens.append(text[i:j])
        i = j

    return tokens

def is_word_token(token, reserved):
    if token in reserved:
        return False
    if not token:
        return False
    if token[0].isdigit():
        return False
    return all(ch in WORD_CHARS for ch in token)

def generate_names(reserved):
    length = 1

    while True:
        total = 26 ** length

        for x in range(total):
            cur = []
            y = x

            for _ in range(length):
                cur.append(chr(ord('a') + (y % 26)))
                y //= 26

            name = ''.join(reversed(cur))

            if name not in reserved:
                yield name

        length += 1

def solve():
    n = int(input())

    reserved = set()
    if n:
        reserved = set(input().split())
    else:
        input()

    m = int(input())

    source_tokens = []

    for _ in range(m):
        line = input().rstrip('\n')

        pos = line.find('#')
        if pos != -1:
            line = line[:pos]

        source_tokens.extend(tokenize(line, reserved))

    gen = generate_names(reserved)

    mapping = {}
    renamed = []

    for tok in source_tokens:
        if is_word_token(tok, reserved):
            if tok not in mapping:
                mapping[tok] = next(gen)
            renamed.append(mapping[tok])
        else:
            renamed.append(tok)

    if not renamed:
        print()
        return

    answer = [renamed[0]]

    for i in range(1, len(renamed)):
        a = renamed[i - 1]
        b = renamed[i]

        merged = a + b
        parsed = tokenize(merged, reserved)

        if len(parsed) == 2 and parsed[0] == a and parsed[1] == b:
            answer.append(b)
        else:
            answer.append(' ')
            answer.append(b)

    print(''.join(answer))

if __name__ == "__main__":
    solve()
```分词器是核心组件。 它使用两次：一次用于恢复原始令牌序列，稍后用于测试两个相邻输出令牌是否可以安全地连接。 

最长保留令牌规则必须在数字和单词识别之前实施。 这符合语句的优先级规则。 例如，如果`while`被保留，字符串`while`必须成为保留标记而不是单词。 

标识符生成器通过增加长度和字典顺序来枚举小写字符串。 任何属于保留集的生成名称都会被跳过。 

间隔阶段故意重用解析器，而不是尝试导出数十种特殊情况。 这可以避免涉及保留令牌重叠的错误，例如`+`相对`++`或数字旁边的标识符。 

## 工作示例

 ### 示例 1

 从语句输入。 

第一个不同的用户词按以下顺序出现：

 | 原词| 指定名称 |
 | ---| ---|
 | 谎言 | 一个 |
 | 编号 | 乙|
 | 返回值 | c |
 | 上一页 | d |
 | 温度| 电子|

 重命名的令牌序列的一部分变为：

 | 代币指数| 代币|
 | ---| ---|
 | 1 | 有趣|
 | 2 | 一个 |
 | 3 | ( |
 | 4 | 乙|
 | 5 | ) |
 | 6 | {|
 | 7 | 变量 |
 | 8 | c |

 现在考虑一些相邻的对。 

| 一个 | 乙| 连接 | 解析结果 | 需要空间|
 | ---| ---| ---| ---| ---|
 | 有趣| 一个 | 富纳 | [乐趣] | 是的 |
 | 一个 | ( | a( | [a, (] | 否 |
 | c | = | c = | [c，=] | 没有 |
 | + | d | +d | [+，d] | 没有 |

 最终输出是：```
fun a(b){var c=1,d=0,e;while(b>0){e=c;c=c+d;d=e;b--;}return c;}
```此示例表明大多数分隔符消失，而空格仅在串联合并标记的情况下保留。 

### 示例 2

 构造的例子：```
Reserved:
+
++

Source:
x + +
```重命名给出：```
a + +
```边界分析：

 | 一个 | 乙| 连接 | 解析结果 | 需要空间|
 | ---| ---| ---| ---| ---|
 | 一个 | + | 一个+ | [一，+] | 没有 |
 | + | + | ++ | [++] | 是的 |

 最终输出：```
a+ +
```如果没有插入的空间，解析器将看到一个`++`令牌。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T + k · L²) | O(T + k · L²) | 解析源代码并重新解析每个相邻的串联 |
 | 空间| O(T)| 存储标记、映射和输出 |

 源代码的总大小只有几千个字符。 即使反复重新解析串联的标记对也是可以忽略不计的。 该解决方案完全符合时间限制和内存限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    # insert solution implementation here
    pass

# sample 1
assert run("""16
fun while return var { } ( ) , ; > = + ++ - --
9
fun fib(num) { # compute fibs
  var return_value = 1, prev = 0, temp;
  while (num > 0) {
    temp = return_value; return_value = return_value + prev;
    prev = temp;
    num--;
  }
  return return_value;
}
""").strip() == "fun a(b){var c=1,d=0,e;while(b>0){e=c;c=c+d;d=e;b--;}return c;}"

# minimum case
assert run("""0

1
abc
""").strip() == "a"

# repeated identifier
assert run("""0

1
foo foo foo
""").strip() == "a a a"

# reserved token overlapping another reserved token
assert run("""2
+ ++
1
x + +
""").strip() == "a+ +"

# identifier next to number
assert run("""0

1
x 123
""").strip() == "a 123"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单一标识符 |`a`| 最小有效程序|
 |`foo foo foo`|`a a a`| 重复单词的一致重命名 |
 |`x + +`和`+`和`++`保留 |`a+ +`| 最长匹配保留令牌歧义 |
 |`x 123`|`a 123`| 字数边界需要分隔符 |

 ## 边缘情况

 考虑看起来像标识符的保留字。```
Reserved:
while

Source:
while x
```分词器分类`while`在考虑“规则”一词之前保留。 它保持不变。 仅有的`x`被重命名为`a`。 输出变为：```
while a
```重命名每个标识符形状的令牌的解决方案将错误地产生`a b`。 

考虑连接后成为一个单词的两个单词。```
Source:
foo bar
```重命名后：```
a b
```连接`ab`解析为单个单词标记。 重新分析会检测到这一点，因为结果是`[ab]`而不是`[a, b]`。 插入一个空格，给出正确的输出`a b`。 

考虑重叠的运算符。```
Reserved:
+
++

Source:
+ +
```连接`++`解析为一个保留令牌。 重新解析返回值`[++]`，因此插入一个空格。 输出保持不变`+ +`，保留原始标记序列。 

考虑一个单词后跟一个数字。```
Source:
abc 123
```重命名后：```
a 123
```连接`a123`是单个单词标记，因为数字可能出现在单词的第一个字符之后。 重新解析捕获了这一点，因此算法插入分隔符并输出`a 123`。 这保留了预期的令牌边界。
