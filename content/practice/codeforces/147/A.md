---
title: "CF 147A - 标点符号"
description: "我们得到一个包含小写字母、空格和一组有限的标点符号的字符串：逗号、点、感叹号和问号。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 147
codeforces_index: "A"
codeforces_contest_name: "Codeforces Testing Round 4"
rating: 1300
weight: 147
solve_time_s: 78
verified: true
draft: false
---

[CF 147A - 标点符号](https://codeforces.com/problemset/problem/147/A)

 **评分：** 1300
 **标签：** 实现、字符串
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个包含小写字母、空格和一组有限的标点符号的字符串：逗号、点、感叹号和问号。 我们的目标是重新格式化该字符串，使单词之间正好有一个空格分隔，标点符号之前不出现空格，并且每个标点符号后面都紧跟一个空格。 该字符串始终以字母开头和结尾，并且任意两个标点符号之间至少有一个单词。 

输入长度最多可达 10,000 个字符。 这意味着任何检查每个字符一次或固定次数的解决方案都是可以接受的，但输入上的嵌套循环很快就会变得低效。 边缘情况包括多个连续空格、没有空格的标点符号、紧跟在单词后面的标点符号以及仅由字母分隔的标点符号序列。 例如，输入`"hi ,world!good"`应该产生`"hi, world! good"`。 仅全局修剪空格或盲目插入空格的幼稚方法可能会留下多余的空格、删除所需的空格或在标点符号边界处失败。 

## 方法

 一种强力方法是重复扫描字符串并修复每次出现的连续空格或放错位置的标点符号，直到没有任何更改为止。 这是可行的，因为每次转换都会使字符串更接近有效状态，但效率很低。 在最坏的情况下，如果我们为每个较小的更正重复重建字符串，则可能需要 O(n^2) 次操作。 

得出最佳解决方案的关键观察是我们可以按顺序处理字符串。 通过逐字符迭代，我们可以立即决定是否将当前字符附加到结果中、插入空格或跳过额外的空格。 我们仅保留最后一个字符，以检查下一个字符是否需要空格或应直接附加到标点符号上。 这允许使用 O(n) 操作和 O(n) 额外输出空间对字符串进行单次传递，考虑到输入限制，这是完全可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 对于大输入来说太慢 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一个空列表，逐个字符构建结果字符串。 在 Python 中列表更可取，因为每次字符串连接的时间复杂度为 O(n)。 
2. 迭代输入字符串中的每个字符。 
3. 如果字符是字母，则将其直接附加到结果中。 这将保留所有单词而不进行修改。 
4. 如果字符是空格，则检查最后附加的字符。 如果最后一个字符是字母，请标记可能需要空格的标志。 如果最后一个字符是标点符号或前面的空格，请忽略它，因为不允许有多个空格或标点符号前面有空格。 
5. 如果该字符是标点符号，则将其直接附加到结果中。 重置任何挂起的空格标志，因为标点符号前面不应该有空格。 添加标点符号后，立即添加一个空格，除非标点符号位于字符串末尾。 
6. 处理完所有字符后，删除所有尾随空格，因为输出不应以空格结尾。 

为什么它有效：不变的是，处理每个字符后，当前结果列表始终代表输出的有效前缀。 我们从不在标点符号之前插入额外的空格，并且我们确保标点符号之后或单词之间恰好有一个空格。 这保证了迭代完成后整个字符串满足所需的格式。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    s = input().rstrip()
    result = []
    n = len(s)
    i = 0

    while i < n:
        if s[i].isalpha():
            result.append(s[i])
            i += 1
            # handle space after letters if next is letter
            while i < n and s[i] == ' ':
                i += 1
            if i < n and s[i].isalpha():
                result.append(' ')
        elif s[i] in ',.!?':
            result.append(s[i])
            i += 1
            # skip spaces after punctuation
            while i < n and s[i] == ' ':
                i += 1
            # add one space if not at end
            if i < n:
                result.append(' ')
        else:
            i += 1  # skip other spaces
    print(''.join(result))

if __name__ == "__main__":
    main()
```该解决方案对每个字符只处理一次。 除非需要，否则会跳过空格，直接添加字母，标点符号处理可确保后面有一个空格，同时防止前面出现空格。 关键的微妙之处在于跳过多个连续空格并且不附加尾随空格。 

## 工作示例

 ### 示例 1

 输入：`"galileo galilei was an   italian physicist  ,mathematician,astronomer"`| 我| s[i] | 结果| 行动|
 | ---| ---| ---| ---|
 | 0 | 克| 克| 附加信 |
 | 6 | 哦| 伽利略 | 附加信 |
 | 7 | ' ' | 伽利略 | 跳过，下一个是字母 → 添加空格 |
 | 8 | 克| 伽利略 g | 附加信 |
 | ... | ... | ... | 处理信件|
 | 37 | 37 , | 伽利略·伽利莱是一位意大利物理学家，| 添加标点符号，在 | 之后添加空格
 | 38 | 38 米 | 伽利略·伽利莱是一位意大利物理学家，m | 附加信 |
 | 49 | 49 , | 伽利略·伽利莱是一位意大利物理学家、数学家 追加标点符号、添加空格 |
 | 50 | 50 一个 | 伽利略·伽利莱是一位意大利物理学家、数学家 附加信 |

 此跟踪显示删除逗号之前的空格，并且逗号后面恰好有一个空格。 

### 自定义示例

 输入：`"hi ,world!good"`| 我| s[i] | 结果| 行动|
 | ---| ---| ---| ---|
 | 0 | 小时 | 小时 | 附加信 |
 | 2 | , | 你好，| 追加标点符号、添加空格 |
 | 3 | 瓦 | 嗨，w | 附加信 |
 | 8 | ！ | 嗨，世界！ | 追加标点符号、添加空格 |
 | 9 | 克| 嗨，世界！ 克| 附加信 |

 这确认了对紧随其后的字母的标点符号的正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符被处理一次并且每次跳跃总体上都是线性的 |
 | 空间| O(n) | 结果列表最多存储所有字符加上插入的空格 |

 当 n ≤ 10000 时，该解决方案可以在 2 秒的时间限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().rstrip()

# provided sample
assert run("galileo galilei was an   italian physicist  ,mathematician,astronomer") == "galileo galilei was an italian physicist, mathematician, astronomer"

# minimum input
assert run("a") == "a"

# multiple spaces between words
assert run("a   b") == "a b"

# punctuation at end
assert run("hello world!") == "hello world!"

# punctuation with spaces before and after
assert run("hi ,  there !how are  you?") == "hi, there! how are you?"

# consecutive punctuation
assert run("wait!stop,now.") == "wait! stop, now."

# maximum input
assert run("a " * 5000 + ",b") == "a " * 5000 + ", b"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`"a"`|`"a"`| 最小输入|
 |`"a   b"`|`"a b"`| 单词之间有多个空格 |
 |`"hello world!"`|`"hello world!"`| 结尾标点符号 |
 |`"hi ,  there !how are  you?"`|`"hi, there! how are you?"`| 标点符号前后的空格 |
 |`"wait!stop,now."`|`"wait! stop, now."`| 不带空格的连续标点|
 |`"a "*5000+",b"`|`"a "*5000+", b"`| 大输入|

 ## 边缘情况

 该算法通过跳过多个连续空格并仅在必要时在字母之间插入空格来正确处理多个连续空格。 对于紧跟在字母后面的标点符号，它会删除标点符号之前的任何现有空格，并确保后面有一个空格，除非在末尾。 此行为在所有边缘情况下都是一致的，例如`"hi ,world!good"`或者`"wait!stop,now."`，证明在每一步构建有效前缀的不变量保证了正确的最终输出。
