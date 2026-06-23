---
title: "CF 105562A - 按字母顺序排列的贵族"
description: "我们得到了一个以自由格式字符串形式书写的姓氏集合。 每个姓氏都可以包含大写字母、小写字母、空格和撇号。"
date: "2026-06-22T12:47:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105562
codeforces_index: "A"
codeforces_contest_name: "2024-2025 ICPC Northwestern European Regional Programming Contest (NWERC 2024)"
rating: 0
weight: 105562
solve_time_s: 52
verified: true
draft: false
---

[CF 105562A - 按字母顺序排列的贵族](https://codeforces.com/problemset/problem/105562/A)

 **评级：** -
 **标签：** -
 **求解时间：** 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个以自由格式字符串形式书写的姓氏集合。 每个姓氏都可以包含大写字母、小写字母、空格和撇号。 任务是使用自定义比较规则而不是整个字符串的标准字典顺序对这些姓氏进行排序。 

排序键是通过忽略字符串中第一个大写字母之前的所有内容来定义的。 从第一个大写字母开始，我们完全按照字符串的显示方式获取其余部分，并使用该子字符串作为比较键。 这些键使用 ASCII 排序按字典顺序进行比较，这意味着大写字母位于小写字母之前，空格是重要字符，撇号也参与排序。 

输出只是根据此规则重新排序的原始姓氏，并保留所有原始格式。 

约束 n ≤ 1000 且字符串长度 ≤ 50 意味着任何 O(n² log n) 或 O(n log n) 解决方案都足够了。 即使我们为每个字符串构建键并直接对它们进行排序，我们最多只能处理 1000 个短字符串，因此预处理和排序的成本仍然微不足道。 

一个微妙的方面是正确识别第一个大写字母。 保证每个字符串中都存在这样的字母，并且从那里开始的子字符串在所有输入中都是唯一的。 这种唯一性确保排序顺序明确，并且不需要稳定的联系。 

重要的边缘情况主要是关于正确解析密钥。 例如，像“van 't Hek”这样的字符串应该从大写 H 开始使用“Hek”，而不是从头开始。 另一种情况是“DeN brAnD hEeK”，其中只有第一个大写 D 相关，因此键成为从该 D 开始的完整字符串，保留混合大小写。 

## 方法

 暴力方法会在排序过程中显式模拟每对字符串之间的比较，并且对于每次比较，从第一个大写字母开始扫描以逐个字符进行比较。 每次比较的成本为 O(L)，其中 L 最多为 50，排序 n 个项目的成本为 O(n log n) 次比较，因此总的来说，这变为 O(n log n · L)。 当 n = 1000 和 L = 50 时，这大约是 1000 × 10 × 50 = 500,000 个字符检查，这已经很小了，但实现会重复重新计算“键的开始”并重新扫描字符串，从而造成不必要的开销。 

关键的观察是每个姓氏的比较键仅取决于固定的子字符串。 我们可以对每个字符串进行一次预处理，从第一个大写字符开始提取后缀，然后使用这个预先计算的键进行排序。 这将比较内部的重复重新计算转变为单个线性预处理过程。 

一旦每个字符串都有其键，排序就成为这些键上的标准字典排序，同时仍然输出原始字符串。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n log n·L) | O(n log n · L) | O(1) 额外 | 已接受 |
 | 最佳（预先计算密钥）| O(n L + n log n) | O(n L + n log n) | O(nL)| 已接受 |

 ## 算法演练

 我们将每个姓氏转换为由其排序键和原始字符串组成的对，然后按键排序。

1. 对于每个输入字符串，从左到右扫描，直到找到第一个大写字母。 该位置定义了有意义的比较开始的位置。 这是必要的，因为它之前的所有内容在问题规则下都是无关紧要的。 
2. 提取从该大写字符开始到字符串末尾的子字符串。 该子字符串是排序键。 我们不会修改大小写或删除空格，因为 ASCII 字典顺序取决于确切的字符。 
3. 为每个输入行存储一对（密钥，原始字符串）。 这保留了原始的输出要求，同时为我们提供了清晰的比较基础。 
4. 使用标准字典顺序按键对所有对进行排序。 
5. 按排序顺序输出原始字符串，忽略键。 

它之所以有效，是基于这样一个事实：两个姓氏之间的每次比较仅取决于它们从第一个大写字母开始的后缀。 通过预先计算该后缀一次，我们可以确保排序过程中的每次比较都符合问题的规则。 由于排序仅取决于这些固定键，并且这些键与手动比较器根据需要生成的键相同，因此结果顺序与预期顺序相同。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    items = []

    for _ in range(n):
        s = input().rstrip("\n")
        start = 0
        for i, ch in enumerate(s):
            if 'A' <= ch <= 'Z':
                start = i
                break
        key = s[start:]
        items.append((key, s))

    items.sort(key=lambda x: x[0])

    for _, s in items:
        print(s)

if __name__ == "__main__":
    solve()
```实现的核心是查找第一个大写字母的预处理循环。 这是每个字符串的简单线性扫描，这是安全的，因为字符串很短。 

然后我们对字符串进行一次切片以形成密钥。 Python 的切片创建了一个新字符串，但考虑到限制，这种开销可以忽略不计。 

排序是使用 Python 的内置 timsort 和 key 函数完成的，该函数仅比较预先计算的键。 

## 工作示例

 考虑第一个带有小子集的示例订购场景：

 输入：```
Bakker
van der Steen
Groot Koerkamp
```我们计算密钥：

 | 字符串| 第一个大写位置 | 关键|
 | --- | --- | --- |
 | 巴克| 0 | 巴克|
 | 范德斯蒂恩| 4 | 斯蒂恩|
 | 格鲁特·科尔坎普 | 0 | 格鲁特·科尔坎普 |

 按key排序后：

 | 关键| 原创|
 | --- | --- |
 | 巴克| 巴克|
 | 格鲁特·科尔坎普 | 格鲁特·科尔坎普 |
 | 斯蒂恩| 范德斯蒂恩|

 输出变为：```
Bakker
Groot Koerkamp
van der Steen
```这显示了如何完全忽略前导小写前缀，并且仅大写后缀控制排序。 

现在考虑一个混合大小写的情况：

 输入：```
DeN bRAnD hEeK
Brand 'Heek
van Brand heek
```按键：

 | 字符串| 关键|
 | --- | --- |
 | 登品牌周 | 登品牌周 |
 | 品牌 'Heek | 品牌 'Heek |
 | 范·布兰德·希克 | 品牌周刊 |

 按字典顺序排序从 ASCII 值开始逐个字符进行比较，其中空格、大写和小写差异很重要。 这会产生与原始 ASCII 比较一致的确定性顺序。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n + nL) | O(n log n + nL) | 扫描每个字符串一次并按键对 n 个项目进行排序 |
 | 空间| O(nL) | 将提取的密钥与原始密钥一起存储 |

 当 n ≤ 1000 且 L ≤ 50 时，两个界限都非常小，并且解在限制范围内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    out = []
    input = sys.stdin.readline

    n = int(input().strip())
    items = []
    for _ in range(n):
        s = input().rstrip("\n")
        start = 0
        for i, ch in enumerate(s):
            if 'A' <= ch <= 'Z':
                start = i
                break
        items.append((s[start:], s))

    items.sort(key=lambda x: x[0])
    return "\n".join(s for _, s in items)

# provided-style samples
assert run("3\nBakker\nvan der Steen\nGroot Koerkamp\n") == "Bakker\nGroot Koerkamp\nvan der Steen"

# minimum size
assert run("1\nAaa\n") == "Aaa"

# all same key prefix but different tails
assert run("3\naA\nbA\ncA\n") == "aA\nbA\ncA"

# punctuation and spaces
assert run("2\nvan 't Hek\nvan 't Aa\n") == "van 't Aa\nvan 't Hek"

# mixed casing stability check
assert run("2\nDeN bRAnD hEeK\nden brandHeek\n") == "DeN bRAnD hEeK\nden brandHeek"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 本身 | 基本情况正确性 |
 | 相同的后缀结构 | 排序顺序 | 字典键处理 |
 | 标点符号大小写 | 确定性顺序| ASCII 敏感比较 |
 | 混合肠衣 | 一致的订购| 正确提取密钥 |

 ## 边缘情况

 一个常见的陷阱是从字符串的开头而不是第一个大写字母开始比较。 例如，在`"van der Steen"`，正确的键是`"Steen"`， 不是`"van der Steen"`。 该算法显式扫描直到`'S'`并从那里进行切片，确保正确性。 

另一种边缘情况是第一个大写字母不是第一个字符的字符串，例如`"fakederSteenOfficial"`。 这里第一个大写是`'S'`，所以关键就变成了`"SteenOfficial"`。 预处理循环保证在切片之前找到该位置，因此不会将不正确的前缀泄漏到比较中。 

最后，混合大小写序列，例如`"DeN bRAnD hEeK"`依赖提取后的原始 ASCII 排序。 由于我们没有对大小写进行标准化，因此大小写差异会完全按照要求保留，并且排序仍然忠实于规范。
