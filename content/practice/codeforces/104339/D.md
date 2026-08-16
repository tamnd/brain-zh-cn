---
title: "CF 104339D - base64 编码"
description: "我们得到了一个字节流，已经以十六进制值的形式提供，我们需要使用标准字母表 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ 将原始二进制数据转换为 Base64 编码的字符串。"
date: "2026-07-01T18:38:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104339
codeforces_index: "D"
codeforces_contest_name: "FAMCS Olympiad for scholars, Qualification (copy)"
rating: 0
weight: 104339
solve_time_s: 62
verified: true
draft: false
---

[CF 104339D - base64 编码](https://codeforces.com/problemset/problem/104339/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个字节流，已经以十六进制值的形式提供，我们需要使用标准字母表将该原始二进制数据转换为 Base64 编码的字符串`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`。 

编码的工作原理是将输入字节分组为三个块。 每组三个字节形成一个 24 位整数。 然后，该 24 位块被分成四个 6 位段，每个段用作 Base64 字母表的索引，以生成四个字符。 如果最后一组少于三个字节，我们仍然通过用零位填充丢失的字节来概念性地构建 24 位块，但输出会被截断并用`=`这样最终的长度就变成了4个字符的倍数。 

输出是表示整个输入的单个连续 Base64 字符串。 

限制允许最多 50,000 字节。 直接的每字节或每位模拟非常好，因为工作量与输入大小呈线性关系。 任何比 O(n) 更糟糕的事情都是不必要的，因为即使是几百万个基本操作在 Python 中也很容易足够快。 

当输入长度不能被三整除时，会出现微妙的边缘情况。 例如，像这样的单字节输入`0F`必须产生两个 Base64 字符，后跟`==`，不是四个计算出的字符，对填充位的解释不正确。 粗心的实现常常会忘记抑制额外的输出或错误地处理填充移位。 

另一个问题是边界处的字节分组。 例如，对于两个字节，该算法仍然通过移入零来形成 24 位块，但在填充之前只有三个 Base64 字符有效。 不正确的屏蔽或无法区分“真实”与“填充”字节会导致不正确的尾随符号。 

## 方法

 强力解释将直接模拟每个字节的位操作，将位连接成不断增长的字符串或整数，然后将其切成 6 位块。 这是可行的，因为 Base64 本质上是一种位打包转换。 然而，重复构建和切片位字符串会带来与具有较大常数因子的位总数成比例的开销，并且循环中的简单字符串连接可能会显着降低 50,000 字节的性能。 

关键的观察结果是 Base64 在固定大小的块中运行。 每 3 个字节独立产生 4 个字符。 这使我们能够以块的形式处理输入，而无需维护不断增长的位缓冲区。 我们没有显式地模拟位，而是使用移位和按位 OR 运算直接计算 24 位整数，然后使用移位提取四个 6 位索引。 

对于最后的部分块，我们仍然以相同的方式计算 24 位值，但我们仅发出前 2 个或 3 个字符，具体取决于我们是否有 1 个或 2 个字节，然后是所需的填充。 

这将问题简化为对字节数组进行简单的线性扫描，并按块进行恒定时间处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解位串构造 | O(n) 具有高常数 | O(n) | 实践太慢 |
 | 块级位操作 | O(n) | O(1) 额外 | 已接受 |

 ## 算法演练

 我们以三个为一组处理输入字节。 

1. 从十六进制字符串中读取所有字节作为整数。 这为我们提供了直接的数值，避免了以后的重复解析。 
2. 以三步迭代字节数组。 对于每个完整组：

 我们通过将第一个字节左移 16 位、第二个字节左移 8 位并按原样添加第三个字节来构造一个 24 位整数。 这会在单个打包值中保留它们的原始顺序。 
3. 从这个 24 位整数中提取四个 6 位段。 为此，我们分别右移 18、12、6 和 0 位，然后用`63`隔离最后 6 位。 每个值都索引到 Base64 字母表中。 
4. 将四个字符附加到输出字符串。 
5. 当剩余字节少于三个时，构造相同的 24 位缓冲区，但将丢失的字节视为零。 如果只剩下一个字节，我们生成两个有效的 Base64 字符并追加`==`。 如果剩余两个字节，我们生成三个字符并追加`=`。 

### 为什么它有效

 正确性来自于以下事实：Base64 是 24 位块和四个 6 位符号之间的双射。 每个完整的三个字节组恰好贡献 24 位，将它们分成固定的 6 位窗口可以保留原始的二进制结构而不会重叠。 填充不会改变编码的前缀，因为缺失的位在编码定义和实现中都一致地用零填充。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

def encode_base64(n, data):
    out = []

    i = 0
    while i < n:
        b1 = data[i]
        i += 1

        b2 = data[i] if i < n else None
        i += 1 if i < n else 0

        b3 = data[i] if i < n else None
        i += 1 if i < n else 0

        # build 24-bit buffer
        x = b1 << 16
        if b2 is not None:
            x |= b2 << 8
        if b3 is not None:
            x |= b3

        # always compute full 4 indices
        c1 = ALPHABET[(x >> 18) & 63]
        c2 = ALPHABET[(x >> 12) & 63]
        c3 = ALPHABET[(x >> 6) & 63]
        c4 = ALPHABET[x & 63]

        if b2 is None:
            out.append(c1 + c2 + "==")
        elif b3 is None:
            out.append(c1 + c2 + c3 + "=")
        else:
            out.append(c1 + c2 + c3 + c4)

    return "".join(out)

def main():
    n = int(input().strip())
    data = list(map(lambda x: int(x, 16), input().split()))
    print(encode_base64(n, data))

if __name__ == "__main__":
    main()
```该实现严格按照最多三个字节的块进行处理。 使用移位的位打包步骤确保我们永远不需要显式管理二进制字符串。 掩蔽与`& 63`保证每个提取的段都是有效的 Base64 索引。 

处理最后一个块时必须小心。 该逻辑显式检查第二个或第三个字节是否存在，并据此决定填充。 一个常见的错误是始终输出四个字符，然后附加填充，这会为短的最终块产生错误的编码。 

## 工作示例

 ### 示例 1

 输入：```
3
43 61 74
```| 步骤| 字节 | 24 位值 | 索引（6 位块）| 输出块 |
 | ---| ---| ---| ---| ---|
 | 1 | 43 61 74 | 43 61 74 包装满块| 16、34、25、52 | Q2F0 |

 此示例是三个字节的完整块，因此不会发生填充。 该算法直接产生四个字符。 

该跟踪显示了从 24 位打包到四个 Base64 符号的清晰映射，确认了完整块的正确性。 

### 示例 2

 输入：```
4
0F DD A4 12
```| 步骤| 字节 | 24 位值 | 指数| 输出块 |
 | ---| ---| ---| ---| ---|
 | 1 | 0F DD A4 | 完整块| 3、61、40、36 | D92k | D92k |
 | 2 | 12 | 12 部分块| 4, 18, 0, 0 | 例如== |

 第一组的行为类似于正常的完整编码。 第二组只有一个字节，因此剩余的两个字节被视为补零。 只有前两个 Base64 字符有意义，输出以`==`。 

此跟踪突出显示了填充如何抑制多余的编码字符，同时仍在内部计算完整的 6 位分解。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字节在恒定时间位操作中只处理一次 |
 | 空间| O(n) | 输出字符串存储输入大小的常量扩展 |

 该算法随输入大小线性缩放，这对于必须至少读取每个字节一次的转换来说是最佳的。 由于有 50,000 字节，总操作量仍然在 Python 的限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    return io.StringIO(sys.stdout.getvalue() if hasattr(sys.stdout, "getvalue") else "")

# helper redefinition for clean runs
def run(inp: str) -> str:
    import sys, io
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    try:
        main()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = backup_stdin
        sys.stdout = backup_stdout

assert run("3\n43 61 74\n") == "Q2F0"
assert run("4\n0F DD A4 12\n") == "D92kEg=="

# single byte
assert run("1\n00\n") == "AA=="

# two bytes
assert run("2\nFF FF\n") == "//8="

# all equal pattern
assert run("3\n00 00 00\n") == "AAAA"

# maximum small repeat pattern
assert run("6\n41 42 43 44 45 46\n") == "QUJDREVG"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 字节零 | AA== | 单字节填充 |
 | 2 字节 FF FF | //8= | 两字节边界情况 |
 | 3 个零字节 | AAAA | 全块正确性|
 | ABCDEF 字节 | 库德雷夫格 | 多个完整块|

 ## 边缘情况

 单字节输入如`00`直接练习填充逻辑。 该算法构建一个24位块`0x000000`，提取全部等于零的索引，产生`AAAA`，然后截断为`AA==`。 这证实了额外字符的抑制发生在提取之后，而不是之前。 

一个两字节输入，例如`FF FF`产生完整的 24 位值`0xFFFF00`。 前三个 Base64 字符有效，但第四个字符被丢弃并替换为`=`。 移位和掩码方法确保我们仍然计算正确的中间值，而无需对位数学进行特殊处理，只是输出长度不同。
