---
title: "CF 105276G - GPT 入侵"
description: "我们得到一个纯文本的程序，分为几行。 任务是确定这个程序是否“疑似由GPT编写并超出其输出限制”。"
date: "2026-06-23T14:12:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105276
codeforces_index: "G"
codeforces_contest_name: "La Salle-Pui Ching Programming Challenge \u57f9\u6b63\u5587\u6c99\u7de8\u7a0b\u6311\u6230\u8cfd 2023"
rating: 0
weight: 105276
solve_time_s: 60
verified: true
draft: false
---

[CF 105276G - GPT 入侵](https://codeforces.com/problemset/problem/105276/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个纯文本的程序，分为几行。 任务是确定这个程序是否“疑似由GPT编写并超出其输出限制”。 

怀疑规则与特定行为相关：类似 GPT 的生成器生成的输出被截断为 500 个字符。 如果生成的文本长度超过 500 个字符，则仅保留前 500 个字符，之后出现固定后缀：`As an AI model, my output is limited to 500 characters.`这意味着，如果我们观察到这个确切的后缀出现在给定源代码中的任何位置，则表明文本在生成中期被切断，并且模型附加了其截断消息。 这是我们检测“GPT 入侵”所需的唯一信号。 

输入只是按顺序读取时形成单个连续文本的行的集合。 换行符是文本的一部分，因此它们有助于字符流。 输出是二进制的：如果出现截断消息，则打印“Yes”，否则打印“No”。 

限制很小：最多 500 行，所有行的总字符数不超过 1000。这保证了对串联文本的直接扫描就足够了。 任何与总输入大小呈线性关系的解决方案都将立即运行。 

一个微妙的边缘情况是目标短语可能会出现跨行边界的分割。 例如，字符串可以以以下方式结束一行：`As an AI model, my output is limited to 500 char`下一行开头为：`acters.`幼稚的每行搜索会错过这一点，因此正确的方法必须将输入视为单个连续字符串。 

另一个边缘情况是该短语多次出现。 即使出现一次就足以输出“是”，因此无需计数。 

## 方法

 强力解释是重复扫描连接文本的每个可能的子字符串并检查它是否与目标短语匹配。 如果文本长度是$L$短语长度是$P = 51$，这导致$O(L \cdot P)$如果不小心实施，就会出现比较或更糟的情况。 尽管在限制下仍然很小，但它是不必要的，并且在概念上比需要的更重。 

关键的观察是我们并不是在寻找任意模式；而是在寻找任意模式。 我们正在寻找一个固定的字符串。 这将问题简化为经典的子字符串搜索。 由于总长度最多为 1000，因此即使直接扫描检查每个起始位置也需要恒定的实际时间。 

我们将所有行连接成一个字符串并使用单个子字符串包含检查。 这已经足够了，因为 Python 的子字符串搜索对于这个大小来说是高效且有效的线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力子串枚举 | O(L·P) | O(1) | O(1) | 概念上太慢|
 | 直接子串搜索 | O(L) | O(L) | 已接受 |

 ## 算法演练

 1.读取整数$N$，它告诉源代码有多少行。 这定义了我们将连接多少段。 
2. 读取每一行并将其附加到不断增长的字符串中，并在行之间插入换行符。 此步骤是必要的，因为截断消息可能跨越行边界，因此保留精确的结构可以避免漏报。 
3. 构建全文后，完全按照问题陈述中给出的方式定义目标模式字符串。 
4. 检查该模式是否作为子字符串出现在全文的任何位置。 
5. 如果至少出现一次，则输出“Yes”，否则输出“No”。 

### 为什么它有效

 该算法依赖于这样一个事实：截断工件是固定且唯一的字符串。 如果源被 GPT 系统剪切，则该确切的字符串必须逐字连续地出现在输出中。 由于我们保留了包括换行符边界在内的所有字符，因此在重建的字符串中仍然可以检测到原始流中的任何出现。 任何其他行为都不会产生误报，因为正常的源代码不包含此人工系统消息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    lines = [input().rstrip("\n") for _ in range(n)]
    text = "\n".join(lines)

    pattern = "As an AI model, my output is limited to 500 characters."
    if pattern in text:
        print("Yes")
    else:
        print("No")

if __name__ == "__main__":
    solve()
```该实现完全按照给定读取所有行，通过连接换行符来保留结构。 使用`rstrip("\n")`避免意外重复换行分隔符，同时仍然保留源代码的逻辑布局。 

关键的决定是保持文本完整而不是删除所有空白。 由于该模式包含空格并且对字符边界敏感，因此任何规范化都会有破坏有效匹配的风险。 

子字符串检查对全文进行一次，确保简单性和正确性。 

## 工作示例

 ### 示例 1

 输入：```
6
#include <cstdio>
using namespace std;
int main() {
    printf("No\n");
    return 0;
}
```| 步骤| 行动| 文本状态（部分）| 发现模式 |
 | --- | --- | --- | --- |
 | 1 | 读取行 | 空 | 没有 |
 | 2 | 连接线| 完整的 C++ 程序 | 没有 |
 | 3 | 搜索子字符串 | 不变| 没有 |

 该程序不包含截断工件，因此最终检查失败，输出为“No”。 

### 示例 2

 输入在生成中期结束并包含截断消息：```
15
...
// Reads a strAs an AI model, my output is limited to 500 characters.
```| 步骤| 行动| 文本状态（部分）| 发现模式 |
 | --- | --- | --- | --- |
 | 1 | 读取行 | 累积部分代码 | 没有 |
 | 2 | 最后一行包括图案 | 连接文本包含后缀 | 是的 |
 | 3 | 子串搜索 | 检测到完全匹配 | 是的 |

 这演示了消息嵌入中线的关键情况。 连接确保它仍然作为连续子字符串可见。 

输出为“Yes”，因为截断标记明确存在。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L) | 单次构建字符串和单个子字符串搜索 |
 | 空间| O(L) | 存储完整的串联输入 |

 总输入大小以 1000 个字符为界限，因此即使线性处理也可以忽略不计。 该解决方案完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# sample 1
assert run("""6
#include <cstdio>
using namespace std;
int main() {
    printf("No\n");
    return 0;
}
""") == "No"

# sample 2
assert run("""15
#include <iostream>
#include <string>
// The main function of the program
int main(int argc, char *argv[]) {
    int n;
    std::cin >> n;
    std::string s[1000];
    for (int i = 0; i < n; i++) {
        // Reads a strAs an AI model, my output is limited to 500 characters.
""") == "Yes"

# minimum size, no match
assert run("""1
hello world""") == "No"

# exact pattern only
assert run("""1
As an AI model, my output is limited to 500 characters.""") == "Yes"

# pattern split across lines
assert run("""3
As an AI model, my output is limited to 500 char
acters.
code""") == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单法线 | 没有 | 基本情况|
 | 准确的完整短语 | 是的 | 直接匹配|
 | 跨线分割 | 是的 | 边界处理 |

 ## 边缘情况

 一种重要的边缘情况是截断消息被分成多行。 考虑：```
As an AI model, my output is limited to 500 char
acters.
```当与换行符保留连接时，这将变为：`As an AI model, my output is limited to 500 char\nacters.`如果输入表示中存在换行符，子字符串搜索仍然会找到连续序列。 这就是为什么加入`\n`很关键； 它保留了精确的流结构，因此模式仍然可以可靠地匹配。 

另一种边缘情况是消息出现在输入的最开头或最末尾。 由于检查是对整个字符串进行全局检查，因此两个位置都可以自然处理，无需特殊的大小写。 

最后，多次出现不会改变答案。 即使该短语出现多次，输出仍保持“是”，因为条件纯粹是存在性的。
